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

namespace MentalHealthBlog.API.Services
{
    enum RegularUserServiceLogTypes
    {
        EMPTY,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }
    public class RegularUserService : IRegularUserService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<IRegularUserService> _regularUserLoggerService;

        public RegularUserService(DataContext context, IMapper mapper, ILogger<IRegularUserService> regularUserLoggerService)
        {
            _context = context;
            _mapper = mapper;
            _regularUserLoggerService = regularUserLoggerService;
        }
        public async Task<Response> GetSharesPerMentalHealthExpert(RegularUserSearchContentDto query)
        {
            try
            {
                var dbShares = await _context.Shares
                    .Include(p => p.SharedPost)
                    .Include(mhe => mhe.SharedWith)
                    .Where(s => s.SharedPost.UserId == query.LoggedUserId)
                    .ToListAsync();

                if (dbShares.IsNullOrEmpty())
                {
                    _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.EMPTY.ToString()}", dbShares);
                    return new Response(new object(), StatusCodes.Status404NotFound, RegularUserServiceLogTypes.NOT_FOUND.ToString());
                }

                var groupedSharesPerDoctor = dbShares
                    .DistinctBy(s=> new {s.SharedPost, s.SharedWith})
                    .GroupBy(s => s.SharedWith);

                if (groupedSharesPerDoctor.IsNullOrEmpty())
                {
                    _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                    return new Response(new object(), StatusCodes.Status404NotFound, RegularUserServiceLogTypes.NOT_FOUND.ToString());
                }

                List<SharesPerMentalHealthExpertDto> sharesPerMentalHealthExpert = await FillListGroupedMentalHealthExpertsAndContentSharedWithThem(groupedSharesPerDoctor);

                if (!sharesPerMentalHealthExpert.IsNullOrEmpty())
                {
                    _regularUserLoggerService.LogInformation($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.SUCCESS.ToString()}", sharesPerMentalHealthExpert);
                    return new Response(sharesPerMentalHealthExpert, StatusCodes.Status200OK, RegularUserServiceLogTypes.SUCCESS.ToString());
                }
                _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.EMPTY.ToString()}", sharesPerMentalHealthExpert);
                return new Response(sharesPerMentalHealthExpert, StatusCodes.Status204NoContent, RegularUserServiceLogTypes.EMPTY.ToString());

            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"SHARES-PER-MENTAL-HEALTH-EXPERT: {e.Message.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status500InternalServerError, RegularUserServiceLogTypes.ERROR.ToString());
            }
        }

        public async Task<Response> RevokeContentPermission(RegularUserPermissionDto request)
        {
            try
            {
                if (request.PostId <= 0 && request.SharedWithId <= 0)
                {
                    _regularUserLoggerService.LogWarning($"REVOKE: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}", request);
                    return new Response(new object(), StatusCodes.Status404NotFound, RegularUserServiceLogTypes.NOT_FOUND.ToString());
                }

                var contentToBeRevoked = await _context.Shares
                    .Where(s => s.SharedPostId == request.PostId && s.SharedWithId == request.SharedWithId)
                    .ToListAsync();

                if (contentToBeRevoked.Any())
                {
                    _context.RemoveRange(contentToBeRevoked);
                    await _context.SaveChangesAsync();
                    //var sharesPerMentalHealthExpert = await GetSharesPerMentalHealthExpert();
                    _regularUserLoggerService.LogInformation($"REVOKE: {RegularUserServiceLogTypes.SUCCESS.ToString()}", contentToBeRevoked);
                    return new Response(contentToBeRevoked, StatusCodes.Status200OK, RegularUserServiceLogTypes.SUCCESS.ToString());
                }
                _regularUserLoggerService.LogWarning($"REVOKE: {RegularUserServiceLogTypes.EMPTY.ToString()}", contentToBeRevoked);
                return new Response(contentToBeRevoked, StatusCodes.Status204NoContent, RegularUserServiceLogTypes.NOT_FOUND.ToString());
            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"REVOKE: {RegularUserServiceLogTypes.ERROR.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status500InternalServerError, RegularUserServiceLogTypes.ERROR.ToString());
            }
        }

        private async Task<List<SharesPerMentalHealthExpertDto>> FillListGroupedMentalHealthExpertsAndContentSharedWithThem(IEnumerable<IGrouping<User, Share>> groupedMentalHealthExpertsAndContentSharedWithThem)
        {
            try
            {
                List<SharesPerMentalHealthExpertDto> sharesPerMentalHealthExpert = new List<SharesPerMentalHealthExpertDto>();
                UserHelper userHelper = new UserHelper(_context);
                ShareHelper shareHelper = new ShareHelper(_context);

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

                        List<PostDto> sharedContentWithMentalHealthExpert = shareHelper.CallFillSharedContent(mentalHealthExpertFromGroup, new List<PostDto>());
                        sharesPerMentalHealthExpert.Add(new SharesPerMentalHealthExpertDto(mentalHealthExpertContentIsSharedWith, sharedContentWithMentalHealthExpert));
                    }
                }
                return sharesPerMentalHealthExpert;
            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"SHARES-PER-MENTAL-HEALTH-EXPERT: {e.Message}", e);
                return new List<SharesPerMentalHealthExpertDto>();
            }
        }


    }
}
