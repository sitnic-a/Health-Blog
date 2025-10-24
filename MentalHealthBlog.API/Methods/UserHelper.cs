using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.API.Methods
{
    public class UserHelper
    {
        private readonly DataContext _context;

        public UserHelper(DataContext context)
        {
            _context = context;
        }

        public async Task<List<Role>> GetUserRolesAsync(UserDto user)
        {
            var useRoles = await _context.UserRoles
                                        .Include(r => r.Role)
                                        .Include(u => u.User)
                                        .Select(ur => new
                                        {
                                            RoleId = ur.RoleId,
                                            RoleName = ur.Role.Name,
                                            UserId = ur.User.Id,
                                        })
                                        .Where(ur => ur.UserId == user.Id || ur.UserId == user.UserId)
                                        .ToListAsync();

            var roles = useRoles.Select(r => new Role(r.RoleId, r.RoleName)).ToList();
            return roles;
        }

        public async Task<List<_PartialCombinedUserDto>> GetCombinedDataFromMentalHealthExpertsAndRegularUsersAsync()
        {
            var allRegularUserEmails = await _context.MentalHealthExperts
                    .Where(mhe => !string.IsNullOrEmpty(mhe.Email))
                    .Join(_context.Users,
                          (mhe) => mhe.UserId,
                          (u) => u.Id,
                          (mhe, u) => new _PartialCombinedUserDto
                          {
                              Id = u.Id,
                              Username = u.Username,
                              Email = mhe.Email,
                              IsMentalHealthExpert = true,
                          })
                    .ToListAsync();

            var allMentalHealthExpertEmails = await _context.RegularUsers
                .Where(ru => !string.IsNullOrEmpty(ru.Email))
                .Join(_context.Users,
                      (ru) => ru.UserId,
                      (u) => u.Id,
                      (ru, u) => new _PartialCombinedUserDto
                      {
                          Id = u.Id,
                          Username = u.Username,
                          Email = ru.Email,
                          IsMentalHealthExpert = false,
                      })
                .ToListAsync();

            var combinedUsers = allMentalHealthExpertEmails.Union(allRegularUserEmails);
            return combinedUsers.ToList();
        }
    }
}
