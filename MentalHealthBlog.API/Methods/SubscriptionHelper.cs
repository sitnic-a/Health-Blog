using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Subscription;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8629

namespace MentalHealthBlog.API.Methods
{
    public class SubscriptionHelper
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ISubscriptionService> _subscriptionLoggerService;

        public SubscriptionHelper(DataContext context, IMapper mapper, ILogger<ISubscriptionService> subscriptionLoggerService)
        {
            _context = context;
            _mapper = mapper;
            _subscriptionLoggerService = subscriptionLoggerService;
        }
        public async Task<List<SubscriptionUsersDto>> MergeMentalHealthExpertsAndRegularUsersSubscription()
        {
            var userHelper = new UserHelper(_context);
            var __MIN_DAYS_UNTIL_EXPIRATION__REMINDER__ = new TimeSpan(2, 0, 0, 0);
            var mostRecentSubscriptions = await _context.Subscriptions
                .OrderBy(s => s.PaidAt)
                .ToListAsync();

            mostRecentSubscriptions = mostRecentSubscriptions
                .DistinctBy(s => s.UserId)
                .ToList();

            var dbRegularUsersSubscriptions = mostRecentSubscriptions
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
                          ExpiringSoon = new TimeSpan(s.ExpiresAt.GetValueOrDefault().Ticks - DateTime.UtcNow.Ticks).Ticks <= new TimeSpan(2, 0, 0, 0).Ticks &&
                                         s.ExpiresAt.GetValueOrDefault() > DateTime.MinValue,
                          PaidAmount = s.PaidAmount,
                          SubscriptionPlanId = s.SubscriptionPlanId.GetValueOrDefault(),
                          HavePaidForSubscription = ru.HavePaidForSubscription,
                          IsInTrialPeriod = ru.IsInTrialPeriod,
                          TrialEndsAt = ru.TrialEndsAt.GetValueOrDefault(),
                      })
                .ToList();

            var dbMentalHealthExperts = mostRecentSubscriptions
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
                          ExpiringSoon = new TimeSpan(s.ExpiresAt.GetValueOrDefault().Ticks - DateTime.UtcNow.Ticks).Ticks <= new TimeSpan(2, 0, 0, 0).Ticks &&
                                         s.ExpiresAt.GetValueOrDefault() > DateTime.MinValue,
                          PaidAmount = s.PaidAmount,
                          SubscriptionPlanId = s.SubscriptionPlanId.GetValueOrDefault(),
                          HavePaidForSubscription = mhe.HavePaidForSubscription,
                          IsInTrialPeriod = mhe.IsInTrialPeriod,
                          TrialEndsAt = mhe.TrialEndsAt.GetValueOrDefault()
                      })
                .ToList();

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
            IEnumerable<SubscriptionUsersDto> filteredSubscriptions = new List<SubscriptionUsersDto>(subscriptions);

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

            return filteredSubscriptions
                .OrderBy(s => s.FirstName)
                .ToList();
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
                var subscriptionPlanAmount = await ReturnTheSubscriptionPlanAmount(userId, isMentalHealthExpert);
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
        public async Task<Response> RecordSubscription(Subscription usersFirstSubscription, CreateSubscriptionDto request, bool isMentalHealthExpert, bool isAddingNewOne)
        {
            try
            {
                int __MONTHLY_REGULAR_USER_SUBSCRIPTION_PLAN_ID__ = 1;
                int __MONTHLY_MENTAL_HEALTH_EXPERT_SUBSCRIPTION_PLAN_ID__ = 3;
                int __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__ = 5;

                float[] regularUserSubsciptionPlanPrices = { 20f, 200f };
                float[] mentalHealthExpertSubsciptionPlanPrices = { 50f, 500f };

                int monthsToExtend = 0;
                int subscriptionPlanId = -1;
                float subscriptionUserPlanAmount = 0;

                var subscriptionHelper = new SubscriptionHelper(_context, _mapper, _subscriptionLoggerService);
                if (request.PaidAmount.HasValue == true)
                {
                    if (usersFirstSubscription.SubscriptionPlanId != null &&
                        usersFirstSubscription.SubscriptionPlanId != __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__)
                    {
                        monthsToExtend = await subscriptionHelper.CalculateSubscriptionInMonths(request.PaidAmount.Value, request.UserId, isMentalHealthExpert, usersFirstSubscription.SubscriptionPlanId);
                        if (isMentalHealthExpert == false &&
                            mentalHealthExpertSubsciptionPlanPrices.Any(p => p == request.PaidAmount.Value))

                        {
                            subscriptionPlanId = __MONTHLY_REGULAR_USER_SUBSCRIPTION_PLAN_ID__;
                        }
                        else if (isMentalHealthExpert == true &&
                            regularUserSubsciptionPlanPrices.Any(p => p == request.PaidAmount.Value))
                        {
                            subscriptionPlanId = __MONTHLY_MENTAL_HEALTH_EXPERT_SUBSCRIPTION_PLAN_ID__;
                        }
                        else
                        {
                            subscriptionPlanId = await subscriptionHelper.GetSubscriptionPlanFromPaidAmount(request.PaidAmount.Value);
                        }

                        if (isAddingNewOne == true)
                        {
                            var newSubscription = new Subscription
                            {
                                UserId = request.UserId,
                                PaidAt = DateTime.UtcNow,
                                ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend),
                                PaidAmount = request.PaidAmount.Value,
                                SubscriptionPlanId = subscriptionPlanId,
                            };
                            await _context.Subscriptions.AddAsync(newSubscription);
                            await _context.SaveChangesAsync();
                            _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                            return new Response(newSubscription, StatusCodes.Status201Created, SubscriptionLogTypes.SUCCCESS.ToString());
                        }

                        usersFirstSubscription.PaidAt = DateTime.UtcNow;
                        usersFirstSubscription.ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend);
                        usersFirstSubscription.PaidAmount = request.PaidAmount.Value;
                        usersFirstSubscription.SubscriptionPlanId = subscriptionPlanId;
                        await _context.SaveChangesAsync();
                        _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                        return new Response(usersFirstSubscription, StatusCodes.Status201Created, "");
                    }

                    if (usersFirstSubscription.SubscriptionPlanId == null ||
                        usersFirstSubscription.SubscriptionPlanId == __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__)
                    {
                        monthsToExtend = await subscriptionHelper.CalculateSubscriptionInMonths(request.PaidAmount.Value, request.UserId, isMentalHealthExpert);
                        if (isMentalHealthExpert == false &&
                            mentalHealthExpertSubsciptionPlanPrices.Any(p => p == request.PaidAmount.Value))

                        {
                            subscriptionPlanId = __MONTHLY_REGULAR_USER_SUBSCRIPTION_PLAN_ID__;
                        }
                        else if (isMentalHealthExpert == true &&
                            regularUserSubsciptionPlanPrices.Any(p => p == request.PaidAmount.Value))
                        {
                            subscriptionPlanId = __MONTHLY_MENTAL_HEALTH_EXPERT_SUBSCRIPTION_PLAN_ID__;
                        }
                        else
                        {
                            subscriptionPlanId = await subscriptionHelper.GetSubscriptionPlanFromPaidAmount(request.PaidAmount.Value);
                        }

                        if (isAddingNewOne == true)
                        {
                            var newSubscription = new Subscription
                            {
                                UserId = request.UserId,
                                PaidAt = DateTime.UtcNow,
                                ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend),
                                PaidAmount = request.PaidAmount.Value,
                                SubscriptionPlanId = subscriptionPlanId,
                            };

                            await _context.Subscriptions.AddAsync(newSubscription);
                            await _context.SaveChangesAsync();
                            _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                            return new Response(newSubscription, StatusCodes.Status201Created, SubscriptionLogTypes.SUCCCESS.ToString());
                        }

                        usersFirstSubscription.PaidAt = DateTime.UtcNow;
                        usersFirstSubscription.ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend);
                        usersFirstSubscription.PaidAmount = request.PaidAmount.Value;
                        usersFirstSubscription.SubscriptionPlanId = subscriptionPlanId;
                        await _context.SaveChangesAsync();
                        _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                        return new Response(usersFirstSubscription, StatusCodes.Status201Created, "");
                    }
                }

                if (request.PaidAmount.HasValue == false)
                {
                    if (usersFirstSubscription.SubscriptionPlanId != null &&
                        usersFirstSubscription.SubscriptionPlanId != __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__)
                    {
                        subscriptionUserPlanAmount = await subscriptionHelper.ReturnTheSubscriptionPlanAmount(request.UserId, isMentalHealthExpert);
                        monthsToExtend = await subscriptionHelper.CalculateSubscriptionInMonths(subscriptionUserPlanAmount, request.UserId, isMentalHealthExpert, usersFirstSubscription.SubscriptionPlanId);

                        if (isAddingNewOne == true)
                        {
                            var newSubscription = new Subscription
                            {
                                UserId = request.UserId,
                                PaidAt = DateTime.UtcNow,
                                ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend),
                                PaidAmount = subscriptionUserPlanAmount,
                                SubscriptionPlanId = usersFirstSubscription.SubscriptionPlanId,
                            };
                            await _context.Subscriptions.AddAsync(newSubscription);
                            await _context.SaveChangesAsync();
                            _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                            return new Response(newSubscription, StatusCodes.Status201Created, SubscriptionLogTypes.SUCCCESS.ToString());
                        }

                        usersFirstSubscription.PaidAt = DateTime.UtcNow;
                        usersFirstSubscription.ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend);
                        usersFirstSubscription.PaidAmount = subscriptionUserPlanAmount;
                        usersFirstSubscription.SubscriptionPlanId = usersFirstSubscription.SubscriptionPlanId;
                        await _context.SaveChangesAsync();
                        _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                        return new Response(usersFirstSubscription, StatusCodes.Status201Created, "");
                    }

                    if (usersFirstSubscription.SubscriptionPlanId != null &&
                        usersFirstSubscription.SubscriptionPlanId == __NOT_PREDEFINED_SUBSCRIPTION_PLAN_ID__)
                    {
                        subscriptionUserPlanAmount = await subscriptionHelper.ReturnTheSubscriptionPlanAmount(request.UserId, isMentalHealthExpert);
                        monthsToExtend = await subscriptionHelper.CalculateSubscriptionInMonths(subscriptionUserPlanAmount, request.UserId, isMentalHealthExpert, usersFirstSubscription.SubscriptionPlanId);
                        if (isMentalHealthExpert == false)
                        {
                            subscriptionPlanId = __MONTHLY_REGULAR_USER_SUBSCRIPTION_PLAN_ID__;
                        }
                        else if (isMentalHealthExpert == true)
                        {
                            subscriptionPlanId = __MONTHLY_MENTAL_HEALTH_EXPERT_SUBSCRIPTION_PLAN_ID__;
                        }

                        if (isAddingNewOne == true)
                        {
                            var newSubscription = new Subscription
                            {
                                UserId = request.UserId,
                                PaidAt = DateTime.UtcNow,
                                ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend),
                                PaidAmount = subscriptionUserPlanAmount,
                                SubscriptionPlanId = subscriptionPlanId,
                            };
                            await _context.Subscriptions.AddAsync(newSubscription);
                            await _context.SaveChangesAsync();
                            _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                            return new Response(newSubscription, StatusCodes.Status201Created, SubscriptionLogTypes.SUCCCESS.ToString());
                        }

                        usersFirstSubscription.PaidAt = DateTime.UtcNow;
                        usersFirstSubscription.ExpiresAt = DateTime.UtcNow.AddMonths(monthsToExtend);
                        usersFirstSubscription.PaidAmount = subscriptionUserPlanAmount;
                        usersFirstSubscription.SubscriptionPlanId = subscriptionPlanId;
                        await _context.SaveChangesAsync();
                        _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                        return new Response(usersFirstSubscription, StatusCodes.Status201Created, "");
                    }
                }

                _subscriptionLoggerService.LogWarning($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUBSCRIPTION_CREATION_FAILED.ToString()}");
                throw new CreateRecordException("Not created!");
            }
            catch (Exception e)
            {
                _subscriptionLoggerService.LogError($"CREATE-SUBSCRIPTION: {e.Message}");
                throw;
            }

        }
    }
}
