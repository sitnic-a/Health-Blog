using AutoMapper;
using MentalHealthBlog.API.Models;
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
                AdminDashboardFilter filter = new AdminDashboardFilter(_context, _mapper);

                var users = new List<UserDto>();
                const int __USER_ROLE__ = 2;
                const int __MENTAL_HEALTH_EXPERT_ROLE__ = 4;

                if (query?.Role > 0 && !query.SearchCondition.IsNullOrEmpty())
                {
                    if (query.Role == __USER_ROLE__)
                    {
                        users = await filter.CallGetRegularUsers(query);
                        if (!users.IsNullOrEmpty())
                        {
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                        }
                        return new Response(new List<UserDto>(), StatusCodes.Status204NoContent, AdminServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString());
                    }

                    if (query.Role == __MENTAL_HEALTH_EXPERT_ROLE__)
                    {
                        users = await filter.CallGetMentalHealthExpert(query);
                        if (!users.IsNullOrEmpty())
                        {
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                        }
                        return new Response(new List<UserDto>(), StatusCodes.Status204NoContent, AdminServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString());
                    }
                }
                var _dbUsers = await _context.Users.ToListAsync();
                users = await filter.CallGetUnfilteredUsers(_dbUsers);
                if (!users.IsNullOrEmpty())
                {
                    return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                }
                return new Response(new List<UserDto>(), StatusCodes.Status204NoContent, AdminServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString());
            }
            catch (Exception e)
            {
                return new Response(e.Data, StatusCodes.Status500InternalServerError, AdminServiceLogTypes.ERROR.ToString());
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
