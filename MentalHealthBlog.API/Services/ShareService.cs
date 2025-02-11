using System.Collections.Generic;
using MentalHealthBlog.API.ExtensionMethods.ExtensionPostClass;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MentalHealthBlog.API.Services
{
    enum ShareServiceLogTypes
    {
        EMPTY,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }
    public class ShareService : IShareService
    {
        private readonly DataContext _context;
        private readonly ILogger<IShareService> _shareLoggerService;
        private const string _ADMIN_ROLE = "Administrator";
        private const string _USER_ROLE = "User";

        public ShareService(DataContext context, ILogger<IShareService> shareLoggerService)
        {
            _context = context;
            _shareLoggerService = shareLoggerService;
        }

        public async Task<Response> ShareByLink(string shareId)
        {
            try
            {
                var dbShares = await _context
                .Shares
                .Include(p => p.SharedPost)
                .Where(s => s.ShareGuid == shareId).ToListAsync();

                if (dbShares.IsNullOrEmpty())
                {
                    _shareLoggerService.LogWarning($"LINK/shareId: {ShareServiceLogTypes.EMPTY.ToString()}", dbShares);
                    return new Response(dbShares, StatusCodes.Status204NoContent, ShareServiceLogTypes.EMPTY.ToString());
                }

                var convertHelper = new PostHelper(_context);
                var sharedContent = new List<PostDto>();

                foreach (var share in dbShares)
                {
                    if (!share.SharedPost.IsNullOrEmpthy())
                    {
                        var post = share.SharedPost;
                        var tags = convertHelper.CallReturnPostTags(post.Id);
                        sharedContent.Add(new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, tags));
                    }
                }

                if (sharedContent.Any())
                {
                    _shareLoggerService.LogInformation($"LINK/shareId: {ShareServiceLogTypes.SUCCESS.ToString()}", sharedContent);
                    return new Response(sharedContent, StatusCodes.Status200OK, ShareServiceLogTypes.SUCCESS.ToString());
                }
                _shareLoggerService.LogWarning($"LINK/shareId: {ShareServiceLogTypes.NOT_FOUND.ToString()}", sharedContent);
                return new Response(new List<PostDto>(), StatusCodes.Status404NotFound, ShareServiceLogTypes.NOT_FOUND.ToString());
            }
            catch (Exception e)
            {
                _shareLoggerService.LogError($"LINK/shareId: {ShareServiceLogTypes.ERROR.ToString()}",e);
                return new Response(e, StatusCodes.Status500InternalServerError, e.Message);
            }
        }
        public async Task<List<UserDto>> GetExpertsAndRelatives()
        {
            try
            {
                var dbMentalHealthExperts = await _context.MentalHealthExperts
                    .Include(u => u.User)
                    .ToListAsync();

                var possibleToShareWith = new List<UserDto>();

                var expertsAndRelatives = _context.UserRoles
                    .Include(r => r.Role)
                    .Include(u => u.User)
                    .Where(ur => ur.Role.Name != _ADMIN_ROLE && ur.Role.Name != _USER_ROLE)
                    .GroupBy(ur => ur.UserId);

                if (dbMentalHealthExperts.IsNullOrEmpty() || expertsAndRelatives.IsNullOrEmpty()) return new List<UserDto>();

                var dbUserRoles = new List<Role>();
                MentalHealthExpert mentalHealthExpert = new MentalHealthExpert();

                foreach (var item in expertsAndRelatives)
                {

                    dbUserRoles = item.Select(r => new Role(r.RoleId, r.Role.Name)).ToList();
                    mentalHealthExpert = dbMentalHealthExperts.FirstOrDefault(u => u.User.Id == item.Key);

                    if (mentalHealthExpert == null ||
                        mentalHealthExpert.User == null ||
                        dbUserRoles.IsNullOrEmpty()) return new List<UserDto>();

                    possibleToShareWith.Add(new UserDto
                    {
                        Id = mentalHealthExpert.UserId,
                        Username = mentalHealthExpert.User.Username,
                        Roles = dbUserRoles,
                        PhoneNumber = mentalHealthExpert.PhoneNumber,
                        Organization = mentalHealthExpert.Organization,
                        Email = mentalHealthExpert.Email,
                        PhotoAsFile = mentalHealthExpert.PhotoAsFile,
                        PhotoAsPath = mentalHealthExpert.PhotoAsPath
                    });
                }
                return possibleToShareWith;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message);
            }

        }

        public async Task<List<Share>> ShareContent(ShareContentDto contentToBeShared)
        {
            var shareHelper = new ShareHelper(_context);

            if (contentToBeShared.ShareLink == false)
            {
                if (contentToBeShared.PostIds.IsNullOrEmpty() ||
                    contentToBeShared.SharedWithIds.IsNullOrEmpty() ||
                    contentToBeShared.PostIds.Contains(0) ||
                    contentToBeShared.SharedWithIds.Contains(0)) return new List<Share>();

                var sharedContent = await shareHelper.CallSaveNewShares(_context, contentToBeShared);
                if (sharedContent.Any()) return sharedContent;
                return new List<Share>();
            }
            if (contentToBeShared.ShareLink == true)
            {
                if (contentToBeShared.PostIds.IsNullOrEmpty() ||
                    contentToBeShared.PostIds.Contains(0)) return new List<Share>();

                var sharedContent = await shareHelper.CallSaveNewShares(_context, contentToBeShared);
                if (sharedContent.Any()) return sharedContent;
                return new List<Share>();
            }
            return new List<Share>();
        }


    }
}
