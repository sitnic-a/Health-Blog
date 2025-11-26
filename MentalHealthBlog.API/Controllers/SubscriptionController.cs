using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Subscription;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("subscription-users")]
        //[Authorize(Roles ="Administrator")]
        public async Task<Response> GetSubscriptionUsers([FromBody] SearchSubscriptionUsersRequestDto? query = null)
        {
            return await _subscriptionService.GetSubscriptionUsers(query);
        }

        [HttpGet("trial/{userId}")]
        public async Task<Response> GetUsersTrialPeriod(int userId)
        {
            return await _subscriptionService.GetUsersTrialPeriod(userId);    
        }

        [HttpGet("user/{userId}/current-subscription")]
        [Authorize]
        public async Task<Response> GetUsersCurrentSubscription(int userId)
        {
            return await _subscriptionService.GetUsersCurrentSubscription(userId);
        }

        [HttpPut("set-subscription-paid-status")]
        [Authorize]
        public async Task<Response> SetSubscriptionPaidStatus([FromBody] SubscriptionStatusRequestDto request)
        {
            return await _subscriptionService.SetSubscriptionPaidStatus(request);
        }
 
        [HttpPut("trial-expired")]
        public async Task<Response> SetTrialToExpired(SubscriptionTrialRequestDto request)
        {
            return await _subscriptionService.SetTrialToExpired(request);
        }

        [HttpPost("expiring-email-notification")]
        public async Task<Response> SendTrialExpiringnEmail(SubscriptionExpiringRequestDto request)
        {
            return await _subscriptionService.SendExpiringEmail(request);
        }


        [HttpPost("create-subscription")]
        public async Task<Response> CreateSubscription([FromBody] CreateSubscriptionDto request)
        {
            return await _subscriptionService.CreateSubscription(request);
        }
    }
}
