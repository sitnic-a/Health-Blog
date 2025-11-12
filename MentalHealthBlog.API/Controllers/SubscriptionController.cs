using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Subscription;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;
        public SubscriptionController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpGet("trial/{userId}")]
        public async Task<Response> GetUsersTrialPeriod(int userId)
        {
            return await _subscriptionService.GetUsersTrialPeriod(userId);    
        }

        [HttpPut("trial-expired")]
        public async Task<Response> SetTrialToExpired(SubscriptionTrialRequestDto request)
        {
            return await _subscriptionService.SetTrialToExpired(request);
        }

        [HttpPost("trial-expiring-email-notification")]
        public async Task<Response> SendTrialExpiringnEmail(TrialPeriodExpiringRequestDto request)
        {
            return await _subscriptionService.SendTrialExpiringnEmail(request);
        }

        [HttpPost("create-subscription")]
        public async Task<Response> MakeSubscription([FromBody] CreateSubscriptionDto request)
        {
            return await _subscriptionService.CreateSubscription(request);
        }
    }
}
