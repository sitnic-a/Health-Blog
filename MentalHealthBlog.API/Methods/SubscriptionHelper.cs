using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Subscription;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

#pragma warning disable CS8629

namespace MentalHealthBlog.API.Methods
{
    public class SubscriptionHelper
    {
        private readonly DataContext _context;
        private readonly ILogger<ISubscriptionService> _subscriptionLoggerService;

        public SubscriptionHelper(DataContext context, ILogger<ISubscriptionService> subscriptionLoggerService)
        {
            _context = context;
            _subscriptionLoggerService = subscriptionLoggerService;
        }
        public async Task<List<SubscriptionUsersDto>> MergeMentalHealthExpertsAndRegularUsersSubscription()
        {
            var userHelper = new UserHelper(_context);
            const int __MIN_DAYS_UNTIL_EXPIRATION__REMINDER__ = 2;

            var dbRegularUsersSubscriptions = await _context.Subscriptions
                .Join((_context.RegularUsers),
                      (s => s.UserId),
                      (ru) => ru.UserId,
                      (s, ru) => new SubscriptionUsersDto
                      {
                          UserId = ru.UserId,
                          FirstName = ru.FirstName,
                          LastName = ru.LastName,
                          Roles = new List<Models.Role>(),
                          PaidAt = s.PaidAt.GetValueOrDefault(),
                          ExpiresAt = s.ExpiresAt.GetValueOrDefault(),
                          ExpiringSoon = s.ExpiresAt.GetValueOrDefault().Day - DateTime.UtcNow.Day < __MIN_DAYS_UNTIL_EXPIRATION__REMINDER__ &&
                                         s.ExpiresAt.GetValueOrDefault() > DateTime.MinValue,
                          PaidAmount = s.PaidAmount,
                          SubscriptionPlanId = s.SubscriptionPlanId.GetValueOrDefault(),
                          HavePaidForSubscription = ru.HavePaidForSubscription,
                          IsInTrialPeriod = ru.IsInTrialPeriod,
                          TrialEndsAt = ru.TrialEndsAt.GetValueOrDefault(),
                      })
                .ToListAsync();

            var dbMentalHealthExperts = await _context.Subscriptions
                .Join((_context.MentalHealthExperts),
                      (s => s.UserId),
                      (mhe) => mhe.UserId,
                      (s, mhe) => new SubscriptionUsersDto
                      {
                          UserId = mhe.UserId,
                          FirstName = mhe.FirstName,
                          LastName = mhe.LastName,
                          Roles = new List<Models.Role>(),
                          PaidAt = s.PaidAt.GetValueOrDefault(),
                          ExpiresAt = s.ExpiresAt.GetValueOrDefault(),
                          ExpiringSoon = s.ExpiresAt.GetValueOrDefault().Day - DateTime.UtcNow.Day < __MIN_DAYS_UNTIL_EXPIRATION__REMINDER__ &&
                                         s.ExpiresAt.GetValueOrDefault() > DateTime.MinValue,
                          PaidAmount = s.PaidAmount,
                          SubscriptionPlanId = s.SubscriptionPlanId.GetValueOrDefault(),
                          HavePaidForSubscription = mhe.HavePaidForSubscription,
                          IsInTrialPeriod = mhe.IsInTrialPeriod,
                          TrialEndsAt = mhe.TrialEndsAt.GetValueOrDefault()
                      })
                .ToListAsync();

            var combinedSubscriptionUsers = dbRegularUsersSubscriptions.Union(dbMentalHealthExperts).ToList();

            foreach (var userFromList in combinedSubscriptionUsers)
            {
                if (userFromList.PaidAt.Value == DateTime.MinValue)
                {
                    userFromList.PaidAt = null;
                    userFromList.ExpiresAt = null;
                    userFromList.ExpiringSoon = false;
                }

                var dbUser = await _context.Users.FindAsync(userFromList.UserId);
                if (dbUser == null)
                {
                    _subscriptionLoggerService.LogWarning($"SUBSCRIPTION-USERS: {SubscriptionLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("User doesn't exist");
                }
                var userDto = new UserDto(dbUser.Id, dbUser.Username);
                var userRoles = await userHelper.GetUserRolesAsync(userDto);

                userFromList.Username = userDto.Username;
                userFromList.Roles = userRoles;
            }

            return combinedSubscriptionUsers;
        }
        public async Task<List<SubscriptionUsersDto>> FilterSubscriptions(List<SubscriptionUsersDto> subscriptions, SearchSubscriptionUsersRequestDto query)
        {
            IQueryable<SubscriptionUsersDto> filteredSubscriptions = subscriptions.AsQueryable();

            if (query.SubscriptionYear > 0)
            {
                filteredSubscriptions = filteredSubscriptions
                    .Where(s => s.PaidAt.GetValueOrDefault().Year == query.SubscriptionYear);
            }

            if (query.SubscriptionMonth > 0)
            {
                filteredSubscriptions = filteredSubscriptions
                    .Where(s => s.PaidAt.GetValueOrDefault().Month == query.SubscriptionMonth);
            }

            if (query.UserTypeId > 0)
            {
                filteredSubscriptions = filteredSubscriptions
                    .Where(s => s.Roles.Any(r => r.Id == query.UserTypeId));
            }

            if (!string.IsNullOrEmpty(query.FirstNameLastNameUsername))
            {
                filteredSubscriptions = filteredSubscriptions
                  .Where(s => s.FirstName.Contains(query.FirstNameLastNameUsername) ||
                              s.LastName.Contains(query.FirstNameLastNameUsername) ||
                              s.Username.Contains(query.FirstNameLastNameUsername));
            }

            return await filteredSubscriptions
                .OrderBy(s => s.FirstName)
                .ToListAsync();
        }
        public async Task<int> CalculateSubscriptionInMonths(float paidAmount, int userId, bool isMentalHealthExpert, int? subscriptionPlanId = null)
        {
            int monthsToExtend = 0;
            int __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__ = 5;
            const float monthlyPriceForRegularUsers = 20f;
            const float monthlyPriceForMentalHealthExperts = 50f;

            if (subscriptionPlanId == null || subscriptionPlanId == __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__)
            {
                if (isMentalHealthExpert == true)
                {
                    monthsToExtend = (int)(paidAmount / monthlyPriceForMentalHealthExperts);
                }
                if (isMentalHealthExpert == false)
                {
                    monthsToExtend = (int)(paidAmount / monthlyPriceForRegularUsers);
                }
            }
            if (subscriptionPlanId != null && subscriptionPlanId > 0 && subscriptionPlanId != __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__)
            {
                var subscriptionPlanAmount = await ReturnTheSubscriptionPlanAmount(userId,isMentalHealthExpert);
                monthsToExtend = (int)(paidAmount / subscriptionPlanAmount);
            }

            return monthsToExtend;
        }
        public async Task<float> ReturnTheSubscriptionPlanAmount(int userId, bool isMentalHealthExpert)
        {
            int __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__ = 5;
            const float monthlyPriceForRegularUsers = 20f;
            const float monthlyPriceForMentalHealthExperts = 50f;

            var subscriptionUser = await _context.Subscriptions
                .Where(s => s.UserId == userId)
                .Include(sp => sp.SubscriptionPlan)
                .FirstAsync();

            if (subscriptionUser != null)
            {
                if (subscriptionUser.SubscriptionPlanId == __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__)
                {
                    if (isMentalHealthExpert)
                    {
                        return monthlyPriceForMentalHealthExperts;
                    }
                    return monthlyPriceForRegularUsers;
                }

                return subscriptionUser.SubscriptionPlan.Price.Value;
            }

            return -1;
        }
        public async Task<int> GetSubscriptionPlanFromPaidAmount(float paidAmount)
        {
            var subscriptionPlans = await _context.SubscriptionPlans.ToListAsync();
            int __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__ = 5;
            foreach (var subscriptionPlan in subscriptionPlans)
            {
                if (subscriptionPlan.Price == paidAmount)
                {
                    return subscriptionPlan.Id;
                }
            }
            return __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__;
        }
        public void ChangeIsPaidForSubscriptionAttributeDependingOnUserType(Tuple<object, bool> tuple)
        {
            MentalHealthExpert dbMentalHealthExpert = new MentalHealthExpert();
            RegularUser dbRegularUser = new RegularUser();
            bool isMentalHealthExpert = tuple.Item2;

            if (isMentalHealthExpert == true)
            {
                dbMentalHealthExpert = tuple.Item1 as MentalHealthExpert;
                if (dbMentalHealthExpert != null)
                {
                    dbMentalHealthExpert.HavePaidForSubscription = true;
                }
            }

            if (isMentalHealthExpert == false)
            {
                dbRegularUser = tuple.Item1 as RegularUser;
                if (dbRegularUser != null)
                {
                    dbRegularUser.HavePaidForSubscription = true;
                }
            }
        }
    }
}
