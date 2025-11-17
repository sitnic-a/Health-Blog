using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services.Subscription
{
    public interface ISubscriptionService
    {
        public Task<Response> GetUsersTrialPeriod(int userId);
        public Task<Response> GetUsersCurrentSubscription(int userId);
        public Task<Response> SetTrialToExpired(SubscriptionTrialRequestDto request);
        public Task<Response> SendTrialExpiringEmail(TrialPeriodExpiringRequestDto request);
        public Task<Response> CreateSubscription(CreateSubscriptionDto request);
    }
}
