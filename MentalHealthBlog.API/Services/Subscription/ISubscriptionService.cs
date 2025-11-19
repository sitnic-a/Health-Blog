using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace MentalHealthBlog.API.Services.Subscription
{
    public interface ISubscriptionService
    {
        public Task<Response> GetUsersTrialPeriod(int userId);
        public Task<Response> GetUsersCurrentSubscription(int userId);
        public Task<Response> SetSubscriptionPaidStatus(SubscriptionStatusRequestDto request);
        public Task<Response> SetTrialToExpired(SubscriptionTrialRequestDto request);
        public Task<Response> SendExpiringEmail(SubscriptionExpiringRequestDto request);
        public Task<Response> CreateSubscription(CreateSubscriptionDto request);
    }
}
