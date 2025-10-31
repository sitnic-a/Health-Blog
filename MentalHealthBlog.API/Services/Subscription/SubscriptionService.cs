using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.API.Services.Subscription
{
    enum SubscriptionLogTypes
    {
        INVALID_DATA,
        SUCCCESS,
        NOT_FOUND
    }
    public class SubscriptionService : ISubscriptionService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ISubscriptionService> _subscriptionLoggerService;
        private const int __USER_ROLE_ID__ = 2;
        private const int __PSYCHOLOGIST_PSYCHOTHERAPIST_ROLE_ID__ = 4;
        public SubscriptionService(DataContext context, IMapper mapper, ILogger<ISubscriptionService> subscriptionLoggerService)
        {
            _context = context;
            _mapper = mapper;
            _subscriptionLoggerService = subscriptionLoggerService;
        }

        public async Task<Response> GetUsersTrialPeriod(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    _subscriptionLoggerService.LogWarning($"TRIAL/[userId]: ${SubscriptionLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var trialPeriodDto = new TrialPeriodDto();
                var userHelper = new UserHelper(_context);

                var dbUser = await _context.Users.FindAsync(userId);
                if (dbUser == null)
                {
                    _subscriptionLoggerService.LogWarning($"TRIAL/[userId]: ${SubscriptionLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("User doesn't exist!");
                }

                var dbUserRoles = await userHelper.GetUserRolesAsync(new UserDto(dbUser.Id, dbUser.Username));
                if (dbUserRoles.Any(r => r.Id == __USER_ROLE_ID__))
                {
                    var dbRegularUser = await _context.RegularUsers.SingleOrDefaultAsync(u => u.UserId == userId);
                    trialPeriodDto = _mapper.Map<TrialPeriodDto>(dbRegularUser);
                }
                else if (dbUserRoles.Any(r => r.Id == __PSYCHOLOGIST_PSYCHOTHERAPIST_ROLE_ID__))
                {
                    var dbMentalHealthExpert = await _context.MentalHealthExperts.SingleOrDefaultAsync(mhe => mhe.UserId == userId);
                    trialPeriodDto = _mapper.Map<TrialPeriodDto>(dbMentalHealthExpert);
                }

                if (trialPeriodDto != null)
                {
                    _subscriptionLoggerService.LogInformation($"TRIAL/[userId]: ${SubscriptionLogTypes.SUCCCESS.ToString()}");
                    return new Response(trialPeriodDto, StatusCodes.Status200OK, $"TRIAL/[userId]: ${SubscriptionLogTypes.SUCCCESS.ToString()}");
                }

                _subscriptionLoggerService.LogWarning($"TRIAL/[userId]: ${SubscriptionLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Users trial period not found!");
            }
            catch (Exception e)
            {
                _subscriptionLoggerService.LogError($"TRIAL/[userId]: ${e.Message}");
                throw;
            }
            
        }
    }
}
