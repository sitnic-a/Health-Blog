using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.ExtensionMethods.ExtensionPostClass;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Therapy;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

#pragma warning disable CS8601, CS8602, CS8600

namespace MentalHealthBlog.API.Services
{
    enum ShareServiceLogTypes
    {
        EMPTY,
        NOT_FOUND,
        CREATED,
        SUCCESS,
        ERROR
    }
    public class ShareService : IShareService
    {
        private readonly DataContext _context;
        private readonly ITherapyRequestService _therapyRequestService;
        private readonly ILogger<IShareService> _shareLoggerService;
        private const string _ADMIN_ROLE = "Administrator";
        private const string _USER_ROLE = "User";

        public ShareService(DataContext context, ITherapyRequestService therapyRequestService, ILogger<IShareService> shareLoggerService)
        {
            _context = context;
            _therapyRequestService = therapyRequestService;
            _shareLoggerService = shareLoggerService;
        }

        public async Task<Response> ShareByLink(string shareId)
        {
            try
            {
                if (shareId.IsNullOrEmpty())
                {
                    _shareLoggerService.LogWarning($"LINK/shareId: {ShareServiceLogTypes.EMPTY.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbShares = await _context.Shares
                .Where(s => s.ShareGuid == shareId)
                .Include(p => p.SharedPost)
                .ToListAsync();

                if (!dbShares.Any())
                {
                    _shareLoggerService.LogWarning($"LINK/shareId: {ShareServiceLogTypes.EMPTY.ToString()}", dbShares);
                    throw new Exception("No content found!");
                }

                var convertHelper = new PostHelper(_context);
                var sharedContent = new List<PostDto>();

                foreach (var share in dbShares)
                {
                    if (!share.SharedPost.IsNullOrEmpthy())
                    {
                        var post = share.SharedPost;
                        var tags = await convertHelper.CallReturnPostTagsAsync(post.Id);
                        var emotions = await convertHelper.CallReturnPostEmotionsAsync(post.Id);
                        var postDto = new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, tags, emotions);
                        postDto.SharedAt = DateTime.UtcNow;

                        if (postDto == null)
                        {
                            _shareLoggerService.LogWarning($"LINK/shareId: {ShareServiceLogTypes.NOT_FOUND.ToString()}");
                            throw new RecordNotFoundException("Content not shared properly!");
                        }

                        sharedContent.Add(postDto);
                        continue;
                    }

                    _shareLoggerService.LogWarning($"LINK/shareId: {ShareServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Content not retrieved properly!");
                }

                if (dbShares.Any() && !sharedContent.Any())
                {
                    _shareLoggerService.LogWarning($"LINK/shareId: {ShareServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Content not retrieved properly!");
                }

                _shareLoggerService.LogInformation($"LINK/shareId: {ShareServiceLogTypes.SUCCESS.ToString()}", sharedContent);
                return new Response(sharedContent, StatusCodes.Status200OK, ShareServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _shareLoggerService.LogError($"LINK/shareId: {e.Message}");
                throw;
            }
        }
        public async Task<Response> ShareContent(ShareContentDto contentToBeShared)
        {
            try
            {
                var shareHelper = new ShareHelper(_context);

                if (contentToBeShared.ShareLink == false)
                {
                    if (!contentToBeShared.PostIds.Any() ||
                        !contentToBeShared.SharedWithIds.Any() ||
                        contentToBeShared.PostIds.Contains(0) ||
                        contentToBeShared.SharedWithIds.Contains(0))
                    {
                        _shareLoggerService.LogWarning($"POST(SHARE-CONTENT): {ShareServiceLogTypes.NOT_FOUND.ToString()}", contentToBeShared);
                        throw new ArgumentException("Bad request!");
                    }

                    var sharedContent = await shareHelper.CallSaveNewShares(_context, contentToBeShared);
                    if (sharedContent.Any())
                    {
                        _shareLoggerService.LogInformation($"POST(SHARE-CONTENT): {ShareServiceLogTypes.CREATED.ToString()}", sharedContent);
                        return new Response(sharedContent, StatusCodes.Status201Created, ShareServiceLogTypes.CREATED.ToString());
                    }

                    _shareLoggerService.LogWarning($"POST(SHARE-CONTENT): {ShareServiceLogTypes.EMPTY.ToString()}", sharedContent);
                    throw new CreateRecordException("Content haven't been shared!");
                }

                if (contentToBeShared.ShareLink == true)
                {
                    if (!contentToBeShared.PostIds.Any() ||
                        contentToBeShared.PostIds.Contains(0))
                    {
                        _shareLoggerService.LogWarning($"POST(SHARE-CONTENT): {ShareServiceLogTypes.NOT_FOUND.ToString()}", contentToBeShared);
                        throw new ArgumentException("Bad request!");
                    }

                    var sharedContent = await shareHelper.CallSaveNewShares(_context, contentToBeShared);
                    if (sharedContent.Any())
                    {
                        _shareLoggerService.LogInformation($"POST(SHARE-CONTENT): {ShareServiceLogTypes.SUCCESS.ToString()}", sharedContent);
                        return new Response(sharedContent, StatusCodes.Status201Created, ShareServiceLogTypes.SUCCESS.ToString());
                    }
                    _shareLoggerService.LogWarning($"POST(SHARE-CONTENT): {ShareServiceLogTypes.EMPTY.ToString()}", sharedContent);
                    throw new CreateRecordException("Content haven't been shared!");
                }

                _shareLoggerService.LogWarning($"POST(SHARE-CONTENT): {ShareServiceLogTypes.NOT_FOUND.ToString()}", new object());
                throw new ArgumentException("Bad request! Content can't be shared!");
            }
            catch (Exception e)
            {
                _shareLoggerService.LogError($"POST(SHARE-CONTENT): {e.Message}");
                throw;
            }
        }
        public async Task<Response> GetExpertsAndRelatives(SearchTherapyRequestDto query)
        {
            try
            {
                var dbMyExperts = await _therapyRequestService.GetMyExperts(query);
                var myExperts = dbMyExperts.ServiceResponseObject as List<MyExpertDto>;

                var hasRegisteredExpertsInDatabase = myExperts?.Any();

                if (hasRegisteredExpertsInDatabase.GetValueOrDefault() == false)
                {
                    _shareLoggerService.LogWarning($"EXPERTS-RELATIVES: {ShareServiceLogTypes.EMPTY.ToString()}", myExperts);
                    return new Response(myExperts, StatusCodes.Status200OK, ShareServiceLogTypes.EMPTY.ToString());
                }

                var possibleToShareWith = new List<UserDto>();

                var dbUserRoles = new List<Role>();
                MentalHealthExpert mentalHealthExpert = new MentalHealthExpert();
                var userHelper = new UserHelper(_context);

                foreach (var item in myExperts)
                {
                    mentalHealthExpert = myExperts
                        .FirstOrDefault(mhe => mhe.MentalHealthExpertUserId == item.MentalHealthExpertUserId).MentalHealthExpert;

                    if (mentalHealthExpert == null)
                        continue;

                    var mentalHealthExpertAsUser = await _context.Users
                    .FindAsync(mentalHealthExpert.UserId);

                    if (mentalHealthExpertAsUser == null)
                        continue;

                    dbUserRoles = await userHelper
                        .GetUserRolesAsync(new UserDto(mentalHealthExpertAsUser.Id, mentalHealthExpertAsUser.Username));

                    if (dbUserRoles == null || !dbUserRoles.Any())
                        continue;

                    possibleToShareWith.Add(new UserDto
                    {
                        Id = mentalHealthExpert.UserId,
                        FirstName = mentalHealthExpert.FirstName,
                        LastName = mentalHealthExpert.LastName,
                        Username = mentalHealthExpertAsUser.Username,
                        Roles = dbUserRoles,
                        PhoneNumber = mentalHealthExpert.PhoneNumber,
                        Organization = mentalHealthExpert.Organization,
                        Email = mentalHealthExpert.Email,
                        PhotoAsFile = mentalHealthExpert.PhotoAsFile,
                        PhotoAsPath = mentalHealthExpert.PhotoAsPath,
                        UserId = mentalHealthExpert.UserId
                    });
                }

                if (hasRegisteredExpertsInDatabase.GetValueOrDefault() == true && !possibleToShareWith.Any())
                {
                    _shareLoggerService.LogInformation($"EXPERTS-RELATIVES: {ShareServiceLogTypes.NOT_FOUND.ToString()}", possibleToShareWith);
                    throw new RecordNotFoundException("Experts couldn't be fetched properly!");
                }
                
                _shareLoggerService.LogInformation($"EXPERTS-RELATIVES: {ShareServiceLogTypes.SUCCESS.ToString()}", possibleToShareWith);
                return new Response(possibleToShareWith, StatusCodes.Status200OK, ShareServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _shareLoggerService.LogError($"EXPERTS-RELATIVES: {e.Message}");
                throw;
            }
        }
    }
}
