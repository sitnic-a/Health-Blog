using System.Collections.Generic;
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
    public class ShareService : IShareService
    {
        private readonly DataContext _context;
        private const string _ADMIN_ROLE = "Administrator";
        private const string _USER_ROLE = "User";

        public ShareService(DataContext context)
        {
            _context = context;
        }
        public async Task<List<UserDto>> GetExpertsAndRelatives()
        {
            try
            {
                var dbUsers = await _context.Users.ToListAsync();
                var possibleToShareWith = new List<UserDto>();

                var expertsAndRelatives = _context.UserRoles
                    .Include(r => r.Role)
                    .Include(u => u.User)
                    .Where(ur => ur.Role.Name != _ADMIN_ROLE && ur.Role.Name != _USER_ROLE)
                    .GroupBy(ur => ur.UserId);

                if (expertsAndRelatives.IsNullOrEmpty()) return new List<UserDto>();

                var dbUserRoles = new List<Role>();
                User user = new User();

                foreach (var item in expertsAndRelatives)
                {
                    dbUserRoles = item.Select(r => new Role(r.RoleId, r.Role.Name)).ToList();
                    user = dbUsers.FirstOrDefault(r => r.Id == item.Key);

                    if (user == null || dbUserRoles.IsNullOrEmpty()) return new List<UserDto>();

                    possibleToShareWith.Add(new UserDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Roles = dbUserRoles,
                        PhoneNumber = "000-111-222",
                        Organization = "Organization gmBH"
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
            var shareHelper = new ShareHelper();

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

            //var sharedContent = new List<Share>();
            //var shareGuid = Guid.NewGuid();

            //foreach (var post in contentToBeShared.PostIds)
            //{
            //    foreach (var shareWith in contentToBeShared.SharedWithIds)
            //    {
            //        var newShare = new Share
            //        {
            //            ShareGuid = shareGuid.ToString(),
            //            SharedPostId = post,
            //            SharedWithId = shareWith,
            //            SharedAt = contentToBeShared.SharedAt.Value
            //        };

            //        sharedContent.Add(newShare);
            //        await _context.Shares.AddAsync(newShare);
            //    }
            //}
            //await _context.SaveChangesAsync();


            return new List<Share>();
        }
    }
}
