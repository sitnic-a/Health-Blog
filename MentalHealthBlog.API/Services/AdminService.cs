using AutoMapper;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MentalHealthBlog.API.Services
{
    enum AdminServiceLogTypes
    {
        EMPTY_OR_NULL_TABLE,
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
                var users = new List<UserDto>();
                var user = new UserDto();

                var _dbUsers = await _context.Users
                    .ToListAsync();

                if (query is not null)
                {

                }

                if (_dbUsers.IsNullOrEmpty())
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString()}", _dbUsers);
                    return new Response(new List<UserDto>(), StatusCodes.Status204NoContent, AdminServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString());
                }

                foreach (var dbUser in _dbUsers)
                {
                    var dbMentalHeathExpert = await _context.MentalHealthExperts
                        .FirstOrDefaultAsync(u => u.UserId == dbUser.Id);
                    var dbUserRoles = _context.UserRoles
                        .Include(r => r.Role)
                        .Include(u => u.User)
                        .Select(r => new
                        {
                            Id = r.Role.Id,
                            Name = r.Role.Name,
                            UserId = r.User.Id,
                        })
                        .Where(u => u.UserId == dbUser.Id)    
                        .ToList();

                    var roles = dbUserRoles.Select(r => new Role(r.Id,r.Name)).ToList();
                    
                    if (dbMentalHeathExpert is not null)
                    {
                        user = _mapper.Map<UserDto>(dbMentalHeathExpert);
                        user.Roles = roles;
                        user.Username = dbUser.Username;
                        users.Add(user);
                        continue;
                    }
                    user = _mapper.Map<UserDto>(dbUser);
                    user.Roles = roles;
                    users.Add(user);
                    continue;
                }
                _adminLoggerService.LogInformation($"{AdminServiceLogTypes.SUCCESS.ToString()}", users);
                return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());

            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<Response> GetNewRegisteredExperts(SearchExpertDto? query = null)
        {
            try
            {
                var dbMentalHealthExperts = await _context.MentalHealthExperts
                    .Include(u => u.User)
                    .Where(mhe => mhe.IsApproved == false && mhe.IsRejected == false)
                    .ToListAsync();

                if (query is not null)
                {
                    if (query.Status == true)
                    {
                        dbMentalHealthExperts = await _context.MentalHealthExperts
                            .Include(u => u.User)
                            .Where(mhe => mhe.IsApproved == true)
                            .ToListAsync();
                    }
                    else if (query.Status == false)
                    {
                        dbMentalHealthExperts = await _context.MentalHealthExperts
                            .Include(u => u.User)
                            .Where(mhe => mhe.IsRejected == true)
                            .ToListAsync();
                    }
                }

                if (dbMentalHealthExperts.IsNullOrEmpty())
                {
                    _adminLoggerService.LogWarning($"NEW-REQUEST: {AdminServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString()}", dbMentalHealthExperts);
                    return new Response(new object(), StatusCodes.Status404NotFound, AdminServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString());
                }
                List<MentalHealthExpertDto> mentalHealthExperts = new List<MentalHealthExpertDto>();

                foreach (var dbMentalHealthExpert in dbMentalHealthExperts)
                {
                    var mentalHealthExpert = _mapper.Map<MentalHealthExpertDto>(dbMentalHealthExpert);
                    if (mentalHealthExpert is null)
                    {
                        _adminLoggerService.LogWarning($"NEW-REQUEST: {AdminServiceLogTypes.NOT_FOUND.ToString()}", mentalHealthExpert);
                        return new Response(new object(), StatusCodes.Status404NotFound, AdminServiceLogTypes.NOT_FOUND.ToString());
                    }
                    mentalHealthExpert.Username = dbMentalHealthExpert.User.Username;
                    mentalHealthExperts.Add(mentalHealthExpert);
                }

                _adminLoggerService.LogInformation($"NEW-REQUEST: {AdminServiceLogTypes.SUCCESS.ToString()}", mentalHealthExperts);
                return new Response(mentalHealthExperts, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"NEW-REQUEST: {AdminServiceLogTypes.ERROR}", e.Message);
                return new Response(e.Data, StatusCodes.Status400BadRequest, AdminServiceLogTypes.ERROR.ToString());
            }
        }

        public async Task<Response> SetRegisteredExpertStatus(RegisterExpertPatchDto patchDto)
        {
            try
            {
                if (patchDto == null)
                {
                    return new Response(new object(), StatusCodes.Status404NotFound, AdminServiceLogTypes.NOT_FOUND.ToString());
                }

                var dbMentalHealthExpert = await _context.MentalHealthExperts
                    .FirstOrDefaultAsync(u => u.UserId == patchDto.MentalHealthExpertId);

                if (dbMentalHealthExpert is not null)
                {
                    dbMentalHealthExpert.IsApproved = patchDto.IsApproved;
                    dbMentalHealthExpert.IsRejected = patchDto.IsRejected;
                    await _context.SaveChangesAsync();
                    var dbMentalHealthExperts = await GetNewRegisteredExperts();
                    return new Response(dbMentalHealthExperts, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                }
                return new Response(new object(), StatusCodes.Status404NotFound, AdminServiceLogTypes.NOT_FOUND.ToString());

            }
            catch (Exception e)
            {
                return new Response(e.Data, StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
