using AutoMapper;
using MentalHealthBlog.API.ExtensionMethods.ExtensionAssignmentClass;
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
        ASSIGNMENT_INVALID_DATA,
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
                ShareHelper shareHelper = new ShareHelper(_context);
                foreach (var userFromGroup in groupedUsersAndTheirShares)
                {
                    var dbUserByKey = await _context.Users.FindAsync(userFromGroup.Key.Id);
                    UserDto userThatSharedContent;

                    if (dbUserByKey is not null)
                    {
                        userThatSharedContent = new UserDto(dbUserByKey.Id, dbUserByKey.Username);
                        List<PostDto> contentUserShared = await shareHelper.CallFillSharedContentAsync(userFromGroup, new List<PostDto>());

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

        public async Task<Response> CreateAssignment(CreateAssignmentDto request)
        {
            try
            {
                if (!request.IsValid())
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString()}", request);
                    return new Response(new object(), StatusCodes.Status400BadRequest, MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString());
                }

                var newAssignment = _mapper.Map<Assignment>(request);
                if (newAssignment == null)
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString()}", newAssignment);
                    return new Response(new object(), StatusCodes.Status400BadRequest, MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString());
                }

                await _context.Assignments.AddAsync(newAssignment);
                await _context.SaveChangesAsync();

                var dbAssignments = await _context.Assignments
                    .OrderByDescending(a => a.CreatedAt)
                    .ToListAsync();

                _mentalExpertLoggerService.LogInformation($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.SUCCESS.ToString()}", newAssignment);
                return new Response(dbAssignments, StatusCodes.Status201Created, MentalExpertServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.ERROR}", e);
                return new Response(e.Data,StatusCodes.Status500InternalServerError,e.Message);
            }
            
        }
    }
}

