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
        private readonly ILogger<IMentalExpertService> _mentalExpertLoggerService;

        public MentalExpertService(DataContext context, ILogger<IMentalExpertService> mentalExpertLoggerService)
        {
            _context = context;
            _mentalExpertLoggerService = mentalExpertLoggerService;
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

                    List<SharesPerUserDto> sharesPerUser = await FillListWithGroupedUsersAndTheirShares(groupedUsersAndTheirShares);

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

        private async Task<List<SharesPerUserDto>> FillListWithGroupedUsersAndTheirShares(IEnumerable<IGrouping<User, Share>> groupedUsersAndTheirShares)
        {
            List<SharesPerUserDto> sharesPerUser = new List<SharesPerUserDto>();
            PostHelper convertHelper = new PostHelper(_context);

            if (groupedUsersAndTheirShares.IsNullOrEmpty())
            {
                _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                return new List<SharesPerUserDto>();
            }

            foreach (var userFromGroup in groupedUsersAndTheirShares)
            {
                var dbUserByKey = await _context.Users.FindAsync(userFromGroup.Key.Id);
                UserDto userThatSharedContent;
                List<PostDto> contentUserShared = new List<PostDto>();

                if (dbUserByKey is not null)
                {
                    userThatSharedContent = new UserDto(dbUserByKey.Id, dbUserByKey.Username);
                    foreach (var sharedContent in userFromGroup)
                    {
                        var post = sharedContent?.SharedPost;
                        if (post is not null)
                        {
                            var postTags = convertHelper.CallReturnPostTags(post.Id);
                            var postDto = new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, postTags);
                            contentUserShared.Add(postDto);
                        }
                    }
                    sharesPerUser.Add(new SharesPerUserDto(userThatSharedContent, contentUserShared));
                }
            }
            return sharesPerUser;
        }
    }
}

