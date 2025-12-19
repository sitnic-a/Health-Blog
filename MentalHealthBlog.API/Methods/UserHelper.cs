using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Subscription;
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
        public async Task<Tuple<object,bool>> ReturnUserAndInfoIsItMentalHealthExpert(int userId)
        {
            bool isMentalHealthExpert = false;
            var tuple = Tuple.Create<object,bool>(new object(), false);
            const int __USER_ROLE_ID__ = 2;
            const int __PSYCHOLOGIST_PSYCHOTHERAPIST_ROLE_ID__ = 4;

            var dbUser = await _context.Users.FindAsync(userId);
            if (dbUser == null)
            {
                throw new RecordNotFoundException("User doesn't exist");
            }

            var userHelper = new UserHelper(_context);
            var userDto = new UserDto(dbUser.Id, dbUser.Username);
            var userRoles = await userHelper.GetUserRolesAsync(userDto);

            if (userRoles.Any(r => r.Id == __USER_ROLE_ID__))
            {
                var dbRegularUser = await _context.RegularUsers.SingleOrDefaultAsync(ru => ru.UserId == userId);
                if (dbRegularUser == null)
                {
                    throw new RecordNotFoundException("User not found!");
                }
                isMentalHealthExpert = false;
                tuple = new Tuple<object,bool>(dbRegularUser, isMentalHealthExpert);
            }
            else if (userRoles.Any(r => r.Id == __PSYCHOLOGIST_PSYCHOTHERAPIST_ROLE_ID__))
            {
                var dbMentalHealthExpert = await _context.MentalHealthExperts.SingleOrDefaultAsync(mhe => mhe.UserId == userId);
                if (dbMentalHealthExpert == null)
                {
                    throw new RecordNotFoundException("User not found!");
                }
                isMentalHealthExpert = true;
                tuple = new Tuple<object, bool>(dbMentalHealthExpert, isMentalHealthExpert);

            }
            return tuple;
        }
    }
}
