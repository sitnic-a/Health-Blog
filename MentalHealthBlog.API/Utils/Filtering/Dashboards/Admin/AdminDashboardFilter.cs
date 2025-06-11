using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
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
        private readonly ILogger<IAdminService> _adminLoggerService;
        private readonly IMapper _mapper;
        public AdminDashboardFilter(DataContext context, ILogger<IAdminService> adminLoggerService, IMapper mapper)
        {
            _context = context;
            _adminLoggerService = adminLoggerService;
            _mapper = mapper;
        }

        private async Task<List<UserDto>> GetUnfilteredUsers(List<User> dbUsers)
        {
            try
            {
                var users = new List<UserDto>();
                const int __ADMIN_ROLE = 1;
                const int __PSYCHOLOGIST_ROLE = 4;

                var usersTableHasRecords = dbUsers.Any();

                if (usersTableHasRecords)
                {
                    var userHelper = new UserHelper(_context);
                    foreach (var dbUser in dbUsers)
                    {
                        var user = _mapper.Map<UserDto>(dbUser);

                        if (user == null)
                        {
                            _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                            throw new RecordNotFoundException("Couldn't fetch users properly!");
                        }
                        var roles = await userHelper.GetUserRolesAsync(user);
                        user.Roles = roles;
                        var isAdmin = roles.Any(r => r.Id == __ADMIN_ROLE);
                        var isMentalHealthExpert = roles.Any(r => r.Id == __PSYCHOLOGIST_ROLE);

                        if (isAdmin)
                        {
                            continue;
                        }


                        var dbMentalHealthExpert = await _context.MentalHealthExperts
                                                    .SingleOrDefaultAsync(u => u.UserId == dbUser.Id);

                        if (dbMentalHealthExpert == null && isMentalHealthExpert)
                        {
                            _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                            throw new RecordNotFoundException("Couldn't fetch users properly!");
                        }
                        else if (!isMentalHealthExpert)
                        {
                            users.Add(user);
                            continue;
                        }

                        user.UserId = dbMentalHealthExpert.UserId;
                        user.FirstName = dbMentalHealthExpert.FirstName;
                        user.LastName = dbMentalHealthExpert.LastName;
                        user.Email = dbMentalHealthExpert.Email;
                        user.Organization = dbMentalHealthExpert.Organization;
                        user.PhoneNumber = dbMentalHealthExpert.PhoneNumber;
                        user.PhotoAsFile = dbMentalHealthExpert.PhotoAsFile;
                        user.PhotoAsPath = dbMentalHealthExpert.PhotoAsPath;
                        user.Roles = roles;
                        users.Add(user);
                    }
                }
                return users.Any() ? users : new List<UserDto>();
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"GET: {AdminServiceLogTypes.ERROR.ToString()}", e);
                throw;
            }
        }

        private async Task<List<UserDto>> GetRegularUsers(SearchUserDto? query = null)
        {
            try
            {
                var users = new List<UserDto>();
                const int __REGULAR_USER_ROLE = 2;
                var dbRegularUsers = await _context.UserRoles
                                    .Include(u => u.User)
                                    .Where(ur => ur.RoleId == __REGULAR_USER_ROLE)
                                    .ToListAsync();

                var registeredRegularUsers = dbRegularUsers.Any();

                if (registeredRegularUsers)
                {

                    var userHelper = new UserHelper(_context);

                    foreach (var dbRegularUser in dbRegularUsers)
                    {
                        var user = new UserDto();
                        var roles = await userHelper.GetUserRolesAsync(user);

                        if (dbRegularUser == null || roles == null)
                        {
                            throw new RecordNotFoundException("Couldn't fetch users properly!");
                        }
                        user.Id = dbRegularUser.UserId;
                        user.Username = dbRegularUser.User.Username;
                        user.Roles = roles;
                        users.Add(user);
                    }
                }
                else
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.EMPTY.ToString()}");
                    return new List<UserDto>();
                }

                if (registeredRegularUsers && !users.Any())
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Users not fetched properly!");
                }

                _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}");
                return users;
            }
            catch (Exception)
            {
                throw;
            }


        }
        private async Task<List<UserDto>> FillMentalHealthExpertUsers(List<MentalHealthExpert> dbMentalHealthExperts)
        {
            var users = new List<UserDto>();
            var userHelper = new UserHelper(_context);

            foreach (var dbMentalHealthExpert in dbMentalHealthExperts)
            {
                if (dbMentalHealthExpert == null)
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("User not found!");
                }
                var dbUser = await _context.Users.FindAsync(dbMentalHealthExpert.UserId);
                if (dbUser != null)
                {
                    var user = _mapper.Map<UserDto>(dbMentalHealthExpert);
                    var roles = await userHelper.GetUserRolesAsync(user);

                    if (user == null || roles.IsNullOrEmpty())
                    {
                        _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("User not found!");
                    }

                    user.Username = dbUser.Username;
                    user.Roles = roles;
                    users.Add(user);
                    continue;
                }
                _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("User not found!");
            }

            return users;
        }
        private async Task<List<UserDto>> GetMentalHealthExpert(SearchUserDto? query = null)
        {
            var dbMentalHealthExperts = new List<MentalHealthExpert>();
            var users = new List<UserDto>();
            if (!query.SearchCondition.IsNullOrEmpty())
            {
                dbMentalHealthExperts = await _context.MentalHealthExperts
                                                     .Where(mhe => mhe.FirstName.Contains(query.SearchCondition) ||
                                                                   mhe.LastName.Contains(query.SearchCondition) ||
                                                                   mhe.Organization.Contains(query.SearchCondition))
                                                     .ToListAsync();

                if (dbMentalHealthExperts.Any())
                {
                    users = await FillMentalHealthExpertUsers(dbMentalHealthExperts);
                    if (!users.Any())
                    {
                        _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Users not fetched properly!");
                    }
                    _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}");
                    return users;
                }

                _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.EMPTY.ToString()}");
                return users;
            }

            dbMentalHealthExperts = await _context.MentalHealthExperts.ToListAsync();
            if (dbMentalHealthExperts.Any())
            {
                users = await FillMentalHealthExpertUsers(dbMentalHealthExperts);
                if (!users.Any())
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Users not fetched properly!");
                }
                _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}");
                return users;
            }

            _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.EMPTY.ToString()}");
            return users;
        }
        public async Task<List<UserDto>> CallGetMentalHealthExpert(SearchUserDto? query = null)
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
