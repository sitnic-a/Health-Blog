using AutoMapper;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

#pragma warning disable CS8602

namespace MentalHealthBlog.API.Utils.Filtering.Dashboards.Admin
{

    public class AdminDashboardFilter
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public AdminDashboardFilter(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        private async Task<List<UserDto>> GetUnfilteredUsers(List<User> dbUsers)
        {
            var users = new List<UserDto>();
            const int __ADMIN_ROLE = 1;
            if (!dbUsers.IsNullOrEmpty())
            {
                var userHelper = new UserHelper(_context);

                foreach (var dbUser in dbUsers)
                {
                    var user = _mapper.Map<UserDto>(dbUser);
                    var roles = await userHelper.GetUserRolesAsync(user);

                    if (roles.Any(r => r.Id == __ADMIN_ROLE))
                    {
                        continue;
                    }

                    var dbMentalHealthExpert = await _context.MentalHealthExperts
                                                .SingleOrDefaultAsync(u => u.UserId == dbUser.Id);

                    if (dbMentalHealthExpert != null)
                    {
                        user.FirstName = dbMentalHealthExpert.FirstName;
                        user.LastName = dbMentalHealthExpert.LastName;
                        user.Organization = dbMentalHealthExpert.Organization;
                        user.PhoneNumber = dbMentalHealthExpert.PhoneNumber;
                        user.PhotoAsFile = dbMentalHealthExpert.PhotoAsFile;
                        user.PhotoAsPath = dbMentalHealthExpert.PhotoAsPath;
                        user.Roles = roles;
                    }
                    users.Add(user);
                }
            }
            return !users.IsNullOrEmpty() ? users : new List<UserDto>();

        }
        private async Task<List<UserDto>> GetRegularUsers(SearchUserDto?query = null)
        {
            const int __REGULAR_USER_ROLE = 2;
            var users = new List<UserDto>();
            var _dbRegularUsers = await _context.UserRoles
                                    .Include(u => u.User)
                                    .Where(ur => ur.RoleId == __REGULAR_USER_ROLE)
                                    .ToListAsync();

            if (!_dbRegularUsers.IsNullOrEmpty())
            {
                foreach (var dbRegularUser in _dbRegularUsers)
                {
                    var user = _mapper.Map<UserDto>(dbRegularUser);
                    users.Add(user);
                }
            }
            return !users.IsNullOrEmpty() ? users : new List<UserDto>();

        }
        private async Task<List<UserDto>> FillMentalHealthExpertUsers(List<MentalHealthExpert>? dbMentalHealthExperts)
        {
            var users = new List<UserDto>();

            if (!dbMentalHealthExperts.IsNullOrEmpty())
            {
                var userHelper = new UserHelper(_context);

                foreach (var dbMentalHealthExpert in dbMentalHealthExperts)
                {
                    var dbUser = await _context.Users.FindAsync(dbMentalHealthExpert.UserId);
                    if (dbUser != null)
                    {
                        var user = _mapper.Map<UserDto>(dbMentalHealthExpert);
                        var roles = await userHelper.GetUserRolesAsync(user);
                        user.Username = dbUser.Username;
                        user.Roles = roles;
                        users.Add(user);
                    }
                }
            }
            return users;
        }
        private async Task<List<UserDto>> GetMentalHealthExpert(SearchUserDto? query = null)
        {
            var _dbMentalHealthExperts = new List<MentalHealthExpert>();
            var users = new List<UserDto>();
            if (!query.SearchCondition.IsNullOrEmpty())
            {
                _dbMentalHealthExperts = await _context.MentalHealthExperts
                                                     .Where(mhe => mhe.FirstName.Contains(query.SearchCondition) ||
                                                                   mhe.LastName.Contains(query.SearchCondition) ||
                                                                   mhe.Organization.Contains(query.SearchCondition))
                                                     .ToListAsync();

                users = await FillMentalHealthExpertUsers(_dbMentalHealthExperts);
            }

            _dbMentalHealthExperts = await _context.MentalHealthExperts.ToListAsync();
            users = await FillMentalHealthExpertUsers(_dbMentalHealthExperts);
            return !users.IsNullOrEmpty() ? users : new List<UserDto>();

        }
        public async Task<List<UserDto>> CallGetMentalHealthExpert(SearchUserDto?query = null)
        {
            return await GetMentalHealthExpert(query);
        }
        public async Task<List<UserDto>> CallGetUnfilteredUsers(List<User> dbUsers)
        {
            return await GetUnfilteredUsers(dbUsers);
        }
        public async Task<List<UserDto>> CallGetRegularUsers(SearchUserDto? query = null)
        {
            return await GetRegularUsers(query);
        }

    }
}
