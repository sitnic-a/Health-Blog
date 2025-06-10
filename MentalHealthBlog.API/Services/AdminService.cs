using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils.Filtering.Dashboards.Admin;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MentalHealthBlog.API.Services
{
    enum AdminServiceLogTypes
    {
        INVALID_DATA,
        EMPTY,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }
    public class AdminService : IAdminService
    {
        private readonly DataContext _context;
        private ILogger<AdminService> _adminLoggerService;
        private IMapper _mapper;

        public AdminService(DataContext context, IMapper mapper, ILogger<AdminService> adminLoggerService)
        {
            _context = context;
            _adminLoggerService = adminLoggerService;
            _mapper = mapper;
        }

        public async Task<Response> Get(SearchUserDto? query = null)
        {
            try
            {
                AdminDashboardFilter filter = new AdminDashboardFilter(_context,_adminLoggerService, _mapper);

                var users = new List<UserDto>();
                const int __USER_ROLE__ = 2;
                const int __MENTAL_HEALTH_EXPERT_ROLE__ = 4;

                var dbUsers = await _context.Users.ToListAsync();
                var usersTableHasRecords = dbUsers.Any();

                if (!usersTableHasRecords)
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.EMPTY.ToString()}");
                    return new Response(new List<UserDto>(), StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                }
                //Exception handling za dio kada smo unijeli query pretragu je ostao neuraden

                if (query?.Role > 0)
                {
                    if (query.Role == __USER_ROLE__)
                    {
                        users = await filter.CallGetRegularUsers(query);

                        if (!users.Any())
                        {
                            _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.EMPTY.ToString()}", users);
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                        }
                        else if (users.Any())
                        {
                            _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}");
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                        }
                    }

                    if (query.Role == __MENTAL_HEALTH_EXPERT_ROLE__)
                    {
                        users = await filter.CallGetMentalHealthExpert(query);
                        if (users.Any())
                        {
                            _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}");
                            return new Response(users,StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                        }
                        else
                        {
                            _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.EMPTY.ToString()}");
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                        }
                    }
                }

                users = await filter.CallGetUnfilteredUsers(dbUsers);
                if (usersTableHasRecords && !users.Any())
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Users not fetched properly!");
                }

                _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}", users);
                return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"GET: {AdminServiceLogTypes.ERROR.ToString()}", e);
                throw;
            }

        }

        public async Task<Response> GetNewRegisteredExperts(SearchExpertDto? query = null)
        {
            try
            {
                var dbMentalHealthExperts = await _context.MentalHealthExperts
                    .Where(mhe => mhe.IsApproved == false && mhe.IsRejected == false)
                    .ToListAsync();
                var registeredNewMentalHealthExperts = dbMentalHealthExperts.Any();

                if (query is not null)
                {
                    if (query.Status == true)
                    {
                        dbMentalHealthExperts = await _context.MentalHealthExperts
                            .Where(mhe => mhe.IsApproved == true)
                            .ToListAsync();
                    }
                    else if (query.Status == false)
                    {
                        dbMentalHealthExperts = await _context.MentalHealthExperts
                            .Where(mhe => mhe.IsRejected == true)
                            .ToListAsync();
                    }
                }

                if (!registeredNewMentalHealthExperts && query == null)
                {
                    _adminLoggerService.LogWarning($"NEW-REQUEST: {AdminServiceLogTypes.EMPTY.ToString()}", dbMentalHealthExperts);
                    return new Response(new List<MentalHealthExpertDto>(), StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                }

                List<MentalHealthExpertDto> mentalHealthExperts = new List<MentalHealthExpertDto>();
                var userHelper = new UserHelper(_context);

                foreach (var dbMentalHealthExpert in dbMentalHealthExperts)
                {
                    var mentalHealthExpert = _mapper.Map<MentalHealthExpertDto>(dbMentalHealthExpert);
                    var mentalHealthExpertAsUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == mentalHealthExpert.UserId);

                    if (mentalHealthExpert != null && mentalHealthExpertAsUser != null)
                    {
                        mentalHealthExpert.Username = mentalHealthExpertAsUser.Username;
                        mentalHealthExperts.Add(mentalHealthExpert);
                        continue;
                    }

                    _adminLoggerService.LogWarning($"NEW-REQUEST: {AdminServiceLogTypes.NOT_FOUND.ToString()}", mentalHealthExpert);
                    throw new RecordNotFoundException("User not found!");
                }

                _adminLoggerService.LogInformation($"NEW-REQUEST: {AdminServiceLogTypes.SUCCESS.ToString()}", mentalHealthExperts);
                return new Response(mentalHealthExperts, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"NEW-REQUEST: {AdminServiceLogTypes.ERROR}", e.Message);
                throw;
            }
        }

        public async Task<Response> SetRegisteredExpertStatus(RegisterExpertPatchDto patchDto)
        {
            try
            {
                if (patchDto == null)
                {
                    _adminLoggerService.LogWarning($"APPROVAL: {AdminServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbMentalHealthExpert = await _context.MentalHealthExperts
                    .FirstOrDefaultAsync(u => u.UserId == patchDto.MentalHealthExpertId);

                if (dbMentalHealthExpert != null)
                {
                    dbMentalHealthExpert.IsApproved = patchDto.IsApproved;
                    dbMentalHealthExpert.IsRejected = patchDto.IsRejected;
                    await _context.SaveChangesAsync();
                    var dbMentalHealthExperts = await GetNewRegisteredExperts();
                    return new Response(dbMentalHealthExperts, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                }

                _adminLoggerService.LogWarning($"APPROVAL: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Couldn't set new status!");
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"APPROVAL: {AdminServiceLogTypes.ERROR.ToString()}", e.Message);
                throw;
            }
        }

        public async Task<Response> RemoveUserById(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    _adminLoggerService.LogWarning($"DELETE/id: {AdminServiceLogTypes.NOT_FOUND.ToString()}", new object());
                    return new Response(new object(), StatusCodes.Status404NotFound, AdminServiceLogTypes.NOT_FOUND.ToString());
                }
                var dbUser = await _context.Users.FindAsync(userId);
                if (dbUser != null)
                {
                    var mentalHealthExpert = await _context.MentalHealthExperts.FirstOrDefaultAsync(mhe => mhe.UserId == dbUser.Id);
                    if (mentalHealthExpert != null)
                    {
                        var removedMentalHealthExpert = _context.MentalHealthExperts.Remove(mentalHealthExpert);
                        var removedMentalHealthExpertAsUser = _context.Users.Remove(dbUser);
                        await _context.SaveChangesAsync();
                        _adminLoggerService.LogInformation($"DELETE/id: {AdminServiceLogTypes.SUCCESS.ToString()}", mentalHealthExpert);
                        return new Response(mentalHealthExpert, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                    }
                    var removedUser = _context.Users.Remove(dbUser);
                    await _context.SaveChangesAsync();
                    _adminLoggerService.LogInformation($"DELETE/id: {AdminServiceLogTypes.SUCCESS.ToString()}", dbUser);
                    return new Response(dbUser, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                }
                _adminLoggerService.LogWarning($"DELETE/id: {AdminServiceLogTypes.NOT_FOUND.ToString()}", dbUser);
                return new Response(new User(), StatusCodes.Status404NotFound, AdminServiceLogTypes.NOT_FOUND.ToString());

            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"DELETE/id: {e.Message}", e);
                return new Response(e.Data, StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
