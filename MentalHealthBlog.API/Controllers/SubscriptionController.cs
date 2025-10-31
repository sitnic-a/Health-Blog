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
    }
}
