using AutoMapper;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

#pragma warning disable CS8620
#pragma warning disable CS8602

namespace MentalHealthBlog.API.Services
{
    enum MentalExpertServiceLogTypes
    {
        EMPTY,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }

    public class MentalExpertService : IMentalExpertService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<IMentalExpertService> _mentalExpertLoggerService;

        public MentalExpertService(DataContext context, IMapper mapper, ILogger<IMentalExpertService> mentalExpertLoggerService)
        {
            _context = context;
            _mapper = mapper;
            _mentalExpertLoggerService = mentalExpertLoggerService;
        }

        public async Task<Response> GetSharesPerMentalHealthExpert()
        {
            try
            {
                var dbShares = await _context.Shares
                    .Include(p => p.SharedPost)
                    .Include(mhe => mhe.SharedWith)
                    .ToListAsync();

                if (dbShares.IsNullOrEmpty())
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {MentalExpertServiceLogTypes.EMPTY.ToString()}", dbShares);
                    return new Response(new object(), StatusCodes.Status404NotFound, MentalExpertServiceLogTypes.NOT_FOUND.ToString());
                }

                var groupedSharesPerDoctor = dbShares.GroupBy(s => s.SharedWith);

                if (groupedSharesPerDoctor.IsNullOrEmpty())
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    return new Response(new object(), StatusCodes.Status404NotFound, MentalExpertServiceLogTypes.NOT_FOUND.ToString());
                }

                List<SharesPerMentalHealthExpertDto> sharesPerMentalHealthExpert = await FillListGroupedMentalHealthExpertsAndContentSharedWithThem(groupedSharesPerDoctor);

                if (!sharesPerMentalHealthExpert.IsNullOrEmpty())
                {
                    _mentalExpertLoggerService.LogInformation($"SHARES-PER-MENTAL-HEALTH-EXPERT: {MentalExpertServiceLogTypes.SUCCESS.ToString()}", sharesPerMentalHealthExpert);
                    return new Response(sharesPerMentalHealthExpert, StatusCodes.Status200OK, MentalExpertServiceLogTypes.SUCCESS.ToString());
                }
                _mentalExpertLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {MentalExpertServiceLogTypes.EMPTY.ToString()}", sharesPerMentalHealthExpert);
                return new Response(sharesPerMentalHealthExpert, StatusCodes.Status204NoContent, MentalExpertServiceLogTypes.EMPTY.ToString());

            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-MENTAL-HEALTH-EXPERT: {e.Message.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status500InternalServerError, MentalExpertServiceLogTypes.ERROR.ToString());
            }
        }

        public async Task<Response> GetSharesPerUser(ExpertSearchContentDto query)
        {
            if (query == null || query.LoggedExpertId <= 0)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.ERROR.ToString()} - QUERY NULL OR WRONG", query);
                return new Response(new object(), StatusCodes.Status400BadRequest, MentalExpertServiceLogTypes.ERROR.ToString());
            }

            try
            {
                var dbShares = await _context.Shares
                .Include(p => p.SharedPost)
                .Include(u => u.SharedPost.User)
                .ToListAsync();

                if (!dbShares.IsNullOrEmpty())
                {
                    var groupedUsersAndTheirShares = dbShares
                        .DistinctBy(p => new
                        {
                            p.SharedPostId,
                            p.SharedWithId
                        })
                        .Where(ex => ex.SharedWithId == query.LoggedExpertId)
                        .GroupBy(u => u.SharedPost.User);

                    if (groupedUsersAndTheirShares.IsNullOrEmpty())
                    {
                        _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                        return new Response(new object(), StatusCodes.Status404NotFound, MentalExpertServiceLogTypes.NOT_FOUND.ToString());
                    }

                    List<SharesPerUserDto> sharesPerUser = await FillListGroupedUsersAndTheirShares(groupedUsersAndTheirShares);

                    if (!sharesPerUser.IsNullOrEmpty())
                    {
                        _mentalExpertLoggerService.LogInformation($"SHARES-PER-USER: {MentalExpertServiceLogTypes.SUCCESS.ToString()}", sharesPerUser);
                        return new Response(sharesPerUser, StatusCodes.Status200OK, MentalExpertServiceLogTypes.SUCCESS.ToString());
                    }
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, MentalExpertServiceLogTypes.EMPTY.ToString());
                }
                _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                return new Response(new object(), StatusCodes.Status204NoContent, MentalExpertServiceLogTypes.EMPTY.ToString());
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.ERROR.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, MentalExpertServiceLogTypes.ERROR.ToString());
            }
        }

        private async Task<List<SharesPerUserDto>> FillListGroupedUsersAndTheirShares(IEnumerable<IGrouping<User, Share>> groupedUsersAndTheirShares)
        {
            try
            {
                List<SharesPerUserDto> sharesPerUser = new List<SharesPerUserDto>();

                foreach (var userFromGroup in groupedUsersAndTheirShares)
                {
                    var dbUserByKey = await _context.Users.FindAsync(userFromGroup.Key.Id);
                    UserDto userThatSharedContent;

                    if (dbUserByKey is not null)
                    {
                        userThatSharedContent = new UserDto(dbUserByKey.Id, dbUserByKey.Username);
                        List<PostDto> contentUserShared = FillSharedContent(userFromGroup, new List<PostDto>());
                        sharesPerUser.Add(new SharesPerUserDto(userThatSharedContent, contentUserShared));
                    }
                }
                return sharesPerUser;
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {e.Message}", e);
                return new List<SharesPerUserDto>();
            }
        }

        private async Task<List<SharesPerMentalHealthExpertDto>> FillListGroupedMentalHealthExpertsAndContentSharedWithThem(IEnumerable<IGrouping<User, Share>> groupedMentalHealthExpertsAndContentSharedWithThem)
        {
            try
            {
                List<SharesPerMentalHealthExpertDto> sharesPerMentalHealthExpert = new List<SharesPerMentalHealthExpertDto>();
                UserHelper userHelper = new UserHelper(_context);

                foreach (var mentalHealthExpertFromGroup in groupedMentalHealthExpertsAndContentSharedWithThem)
                {
                    var dbMentalHealthExpertByKey = await _context.MentalHealthExperts.FirstOrDefaultAsync(mhe => mhe.UserId == mentalHealthExpertFromGroup.Key.Id);
                    UserDto mentalHealthExpertContentIsSharedWith = new UserDto();

                    if (dbMentalHealthExpertByKey is not null)
                    {
                        mentalHealthExpertContentIsSharedWith = _mapper.Map<UserDto>(dbMentalHealthExpertByKey);
                        mentalHealthExpertContentIsSharedWith.Username = mentalHealthExpertFromGroup.Key.Username;
                        var mentalHealthExpertRoles = await userHelper.GetUserRolesAsync(mentalHealthExpertContentIsSharedWith);
                        mentalHealthExpertContentIsSharedWith.Roles = mentalHealthExpertRoles;

                        List<PostDto> sharedContentWithMentalHealthExpert = FillSharedContent(mentalHealthExpertFromGroup, new List<PostDto>());
                        sharesPerMentalHealthExpert.Add(new SharesPerMentalHealthExpertDto(mentalHealthExpertContentIsSharedWith, sharedContentWithMentalHealthExpert));
                    }
                }
                return sharesPerMentalHealthExpert;
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-MENTAL-HEALTH-EXPERT: {e.Message}", e);
                return new List<SharesPerMentalHealthExpertDto>();
            }
        }

        private List<PostDto> FillSharedContent(IGrouping<User, Share> userAndContent, List<PostDto> content)
        {
            PostHelper convertHelper = new PostHelper(_context);

            foreach (var sharedPost in userAndContent)
            {
                var post = sharedPost?.SharedPost;
                if (post is not null)
                {
                    var postTags = convertHelper.CallReturnPostTags(post.Id);
                    var postDto = new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, postTags);
                    postDto.SharedAt = sharedPost?.SharedAt;
                    content.Add(postDto);
                }
            }
            return content;
        }
    }
}

