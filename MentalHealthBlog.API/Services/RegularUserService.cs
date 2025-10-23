using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8620, CS8602, CS8604, 

namespace MentalHealthBlog.API.Services
{
    enum RegularUserServiceLogTypes
    {
        INVALID_DATA,
        EMPTY,
        NULL,
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

                if (query == null || query.LoggedUserId <= 0)
                {
                    _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.NULL.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbShares = await _context.Shares
                    .Where(s => s.SharedPost.UserId == query.LoggedUserId && 
                                s.SharedWithId != null && 
                                s.SharedWithId > 0 &&
                                s.IsKeepingContent == null)
                    .Include(p => p.SharedPost)
                    .Include(mhe => mhe.SharedWith)
                    .OrderByDescending(s => s.SharedAt)
                    .ToListAsync();

                var hasSharedWithMentalHealthExperts = dbShares.Any();

                if (!hasSharedWithMentalHealthExperts)
                {
                    _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.EMPTY.ToString()}", dbShares);
                    return new Response(new List<SharesPerMentalHealthExpertDto>(), StatusCodes.Status200OK, RegularUserServiceLogTypes.EMPTY.ToString());
                }

                var groupedSharesPerDoctor = dbShares
                    .DistinctBy(s => new { s.SharedPost, s.SharedWith })
                    .GroupBy(s => s.SharedWith);

                if (hasSharedWithMentalHealthExperts && !groupedSharesPerDoctor.Any())
                {
                    _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Posts you shared was not retrieved properly!");
                }

                List<SharesPerMentalHealthExpertDto> sharesPerMentalHealthExpert = await FillListGroupedMentalHealthExpertsAndContentSharedWithThem(groupedSharesPerDoctor);

                if (sharesPerMentalHealthExpert.Any())
                {
                    _regularUserLoggerService.LogInformation($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.SUCCESS.ToString()}", sharesPerMentalHealthExpert);
                    return new Response(sharesPerMentalHealthExpert, StatusCodes.Status200OK, RegularUserServiceLogTypes.SUCCESS.ToString());
                }

                _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}", sharesPerMentalHealthExpert);
                throw new RecordNotFoundException("Posts you shared was not retrieved properly!");
            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"SHARES-PER-MENTAL-HEALTH-EXPERT: {e.Message}");
                throw;
            }
        }
        public async Task<Response> GetRecentSharesPerMentalHealthExpert(RegularUserSearchContentDto query)
        {
            try
            {
                if (query == null || query.LoggedUserId <= 0)
                {
                    _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NULL.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var userShares = await _context.Shares
                    .Where(s => s.SharedPost.UserId == query.LoggedUserId && 
                                s.SharedWithId > 0 && 
                                s.IsKeepingContent == null)
                    .OrderByDescending(s => s.SharedAt)
                    .Take(5)
                    .Include(s => s.SharedPost)
                    .Include(mhe => mhe.SharedWith)
                    .ToListAsync();

                var userSharedContentWithAnyone = userShares.Any();

                if (userSharedContentWithAnyone)
                {
                    userShares = userShares.DistinctBy(s => new { s.SharedPost, s.SharedWith }).ToList();
                    List<RecentSharesDto> recentShares = new List<RecentSharesDto>();
                    var userHelper = new UserHelper(_context);
                    foreach (var share in userShares)
                    {
                        if (share != null && share.SharedPost != null && share.SharedWith != null)
                        {
                            var sharedPost = _mapper.Map<PostDto>(share.SharedPost);
                            if (sharedPost == null)
                            {
                                _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                                throw new RecordNotFoundException("Shared content couldn't get detected!");
                            }
                            sharedPost.SharedAt = share?.SharedAt;

                            var mentalHealthExpert = await _context.MentalHealthExperts
                                .FirstOrDefaultAsync(mhe => mhe.Id == share.SharedWithId);
                            if (mentalHealthExpert == null)
                            {
                                _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                                throw new RecordNotFoundException("Expert couldn't get detected!");
                            }
                            var mentalHealthExpertAsUser = await _context.Users
                                .FirstOrDefaultAsync(u => u.Id == mentalHealthExpert.UserId);
                            if (mentalHealthExpertAsUser == null)
                            {
                                _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                                throw new RecordNotFoundException("Expert couldn't get detected!");
                            }
                            var mentalHealthExpertDto = new UserDto(mentalHealthExpertAsUser.Id, mentalHealthExpertAsUser.Username);
                            var sharedWith = _mapper.Map<UserDto>(mentalHealthExpert);
                            if (sharedWith == null)
                            {
                                _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                                throw new RecordNotFoundException("Expert couldn't get detected!");
                            }
                            sharedWith.Username = mentalHealthExpertAsUser.Username;
                            sharedWith.Roles = await userHelper.GetUserRolesAsync(mentalHealthExpertDto);

                            if (sharedPost != null && sharedWith != null)
                            {
                                recentShares.Add(new RecentSharesDto(sharedPost, sharedWith));
                                continue;
                            }

                            _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                            throw new RecordNotFoundException("Recent shares couldn't be fetched properly!");
                        }

                        _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Recent shares couldn't be fetched properly!");
                    }

                    if (userSharedContentWithAnyone && !recentShares.Any())
                    {
                        _regularUserLoggerService.LogWarning($"RECENT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Recent shares not available!");
                    }

                    _regularUserLoggerService.LogInformation($"RECENT: {RegularUserServiceLogTypes.SUCCESS.ToString()}");
                    return new Response(recentShares, StatusCodes.Status200OK, RegularUserServiceLogTypes.SUCCESS.ToString());
                }
                _regularUserLoggerService.LogInformation($"RECENT: {RegularUserServiceLogTypes.EMPTY.ToString()}");
                return new Response(new List<RecentSharesDto>(), StatusCodes.Status200OK, RegularUserServiceLogTypes.EMPTY.ToString());
            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"RECENT: {e.Message}");
                throw;
            }
        }
        public async Task<Response> RevokeContentPermission(RegularUserPermissionDto request)
        {
            try
            {
                if (request.PostId <= 0 || request.SharedWithId <= 0 || request.LoggedUserId <= 0)
                {
                    _regularUserLoggerService.LogWarning($"REVOKE: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}", request);
                    throw new ArgumentException("Bad request!");
                }

                var contentToBeRevoked = await _context.Shares
                    .Where(s => s.SharedPostId == request.PostId && s.SharedWithId == request.SharedWithId)
                    .ToListAsync();

                if (contentToBeRevoked.Any())
                {
                    _context.RemoveRange(contentToBeRevoked);
                    await _context.SaveChangesAsync();
                    var query = new RegularUserSearchContentDto
                    {
                        LoggedUserId = request.LoggedUserId
                    };

                    var sharesPerMentalHealthExpert = await GetSharesPerMentalHealthExpert(query);
                    _regularUserLoggerService.LogInformation($"REVOKE: {RegularUserServiceLogTypes.SUCCESS.ToString()}", contentToBeRevoked);
                    return new Response(sharesPerMentalHealthExpert, StatusCodes.Status200OK, RegularUserServiceLogTypes.SUCCESS.ToString());
                }

                _regularUserLoggerService.LogWarning($"REVOKE: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}", contentToBeRevoked);
                throw new RecordNotFoundException("Permissions not located!");
            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"REVOKE: {e.Message}");
                throw;
            }
        }
        private async Task<List<SharesPerMentalHealthExpertDto>> FillListGroupedMentalHealthExpertsAndContentSharedWithThem(IEnumerable<IGrouping<MentalHealthExpert, Share>> groupedMentalHealthExpertsAndContentSharedWithThem)
        {
            try
            {
                List<SharesPerMentalHealthExpertDto> sharesPerMentalHealthExpert = new List<SharesPerMentalHealthExpertDto>();
                UserHelper userHelper = new UserHelper(_context);
                ShareHelper shareHelper = new ShareHelper(_context);

                foreach (var mentalHealthExpertFromGroup in groupedMentalHealthExpertsAndContentSharedWithThem)
                {
                    if (mentalHealthExpertFromGroup == null)
                    {
                        _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Couldn't get posts you shared!");
                    }

                    var dbMentalHealthExpertByKey = await _context.MentalHealthExperts
                        .SingleOrDefaultAsync(mhe => mhe.Id == mentalHealthExpertFromGroup.Key.Id);

                    if (dbMentalHealthExpertByKey == null)
                    {
                        _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Couldn't get posts you shared!");
                    }

                    UserDto mentalHealthExpertContentIsSharedWith = _mapper.Map<UserDto>(dbMentalHealthExpertByKey);
                    var mentalHealthExpertAsUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == mentalHealthExpertContentIsSharedWith.UserId);
                    var mentalHealthExpertRoles = await userHelper.GetUserRolesAsync(mentalHealthExpertContentIsSharedWith);

                    mentalHealthExpertContentIsSharedWith.Username = mentalHealthExpertAsUser.Username;
                    mentalHealthExpertContentIsSharedWith.Roles = mentalHealthExpertRoles;

                    CurrentAndHistorySharedContent currentAndHistorySharedContentWithMentalHealthExpert = await shareHelper.CallFillSharedContentAsync(mentalHealthExpertFromGroup, new CurrentAndHistorySharedContent());
                    List<PostDto> sharedContentWithMentalHealthExpert = currentAndHistorySharedContentWithMentalHealthExpert.SharedContent;
                    List<PostDto> history = currentAndHistorySharedContentWithMentalHealthExpert.History;

                    if (sharedContentWithMentalHealthExpert.Any() && mentalHealthExpertContentIsSharedWith != null)
                    {
                        sharedContentWithMentalHealthExpert = sharedContentWithMentalHealthExpert
                            .OrderByDescending(s => s.SharedAt)
                            .ToList();
                        var shareContentWithMentalHealthExpertObject = new SharesPerMentalHealthExpertDto(mentalHealthExpertContentIsSharedWith, sharedContentWithMentalHealthExpert);
                        if (history.Any())
                        {
                            shareContentWithMentalHealthExpertObject.History = history;
                        }
                        sharesPerMentalHealthExpert.Add(shareContentWithMentalHealthExpertObject);
                        continue;
                    }

                    _regularUserLoggerService.LogWarning($"SHARES-PER-MENTAL-HEALTH-EXPERT: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Couldn't get posts you shared!");
                }

                return sharesPerMentalHealthExpert;
            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"SHARES-PER-MENTAL-HEALTH-EXPERT: {e.Message}");
                throw;
            }
        }

        public async Task<Response> GetExpertsThatGaveAssignmentsToUser(RegularUserSearchContentDto query)
        {
            try
            {
                if (query == null || query.LoggedUserId <= 0)
                {
                    _regularUserLoggerService.LogWarning($"EXPERTS-THAT-GAVE-ASSIGNMENTS-TO-USER: {RegularUserServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var usersCurrentMentalHealthExperts = await _context.TherapyRequests
                    .Where(tr => tr.RegularUserId == query.LoggedUserId &&
                                 tr.RequestStatus == RequestStatusEnum.Approved)
                    .ToListAsync();

                var dbAssignmentsFromCurrentMentalHealthExperts = new List<Assignment>();

                foreach (var currentMentalHealthExpert in usersCurrentMentalHealthExperts)
                {
                    var assignmentByMentalHealthExpert = await _context.Assignments
                        .Where(a => a.AssignmentGivenToId == query.LoggedUserId &&
                                    a.AssignmentGivenById == currentMentalHealthExpert.MentalHealthExpertId)
                        .ToListAsync();

                    dbAssignmentsFromCurrentMentalHealthExperts.AddRange(assignmentByMentalHealthExpert);
                }


                if (!dbAssignmentsFromCurrentMentalHealthExperts.Any())
                {
                    _regularUserLoggerService.LogWarning($"EXPERTS-THAT-GAVE-ASSIGNMENTS-TO-USER: {RegularUserServiceLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("User doesn't have set assignments!");
                }

                var groupedMentalHealthExpertsThatSetAssignments = dbAssignmentsFromCurrentMentalHealthExperts
                    .GroupBy(mhe => mhe.AssignmentGivenById);

                var mentalHealthExpertsThatGaveAssignments = new List<UserDto>();
                var userHelper = new UserHelper(_context);

                foreach (var item in groupedMentalHealthExpertsThatSetAssignments)
                {
                    var dbMentalHealthExpertAsUser = await _context.Users.FindAsync(item.Key);
                    var dbMentalHealthExpert = await _context.MentalHealthExperts
                        .SingleOrDefaultAsync(mhe => mhe.UserId == item.Key);

                    var userRoles = await userHelper.GetUserRolesAsync(new UserDto(dbMentalHealthExpertAsUser.Id, dbMentalHealthExpertAsUser.Username));

                    var mentalHealthExpertDto = new UserDto
                    {
                        Id = dbMentalHealthExpert.Id,
                        UserId = dbMentalHealthExpert.UserId,
                        FirstName = dbMentalHealthExpert.FirstName,
                        LastName = dbMentalHealthExpert.LastName,
                        Organization = dbMentalHealthExpert.Organization,
                        PhoneNumber = dbMentalHealthExpert.PhoneNumber,
                        Email = dbMentalHealthExpert.Email,
                        PhotoAsFile = dbMentalHealthExpert.PhotoAsFile,
                        PhotoAsPath = dbMentalHealthExpert.PhotoAsPath,
                        Username = dbMentalHealthExpertAsUser.Username,
                        Roles = userRoles
                    };

                    if (mentalHealthExpertDto == null)
                    {
                        continue;
                    }

                    mentalHealthExpertsThatGaveAssignments.Add(mentalHealthExpertDto);
                }

                if (groupedMentalHealthExpertsThatSetAssignments.Any() && !mentalHealthExpertsThatGaveAssignments.Any())
                {
                    _regularUserLoggerService.LogWarning($"EXPERTS-THAT-GAVE-ASSIGNMENTS-TO-USER: {RegularUserServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Data not found!");
                }

                _regularUserLoggerService.LogInformation($"EXPERTS-THAT-GAVE-ASSIGNMENTS-TO-USER: {RegularUserServiceLogTypes.SUCCESS.ToString()}");
                return new Response(mentalHealthExpertsThatGaveAssignments, StatusCodes.Status200OK, $"EXPERTS-THAT-GAVE-ASSIGNMENTS-TO-USER: {RegularUserServiceLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _regularUserLoggerService.LogError($"EXPERTS-THAT-GAVE-ASSIGNMENTS-TO-USER: {e.Message}");
                throw;
            }
        }
    }
}
