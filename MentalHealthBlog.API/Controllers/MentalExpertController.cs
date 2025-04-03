using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MentalExpertController : ControllerBase
    {
        private readonly IMentalExpertService _mentalExpertService;

        public MentalExpertController(IMentalExpertService mentalExpertService)
        {
            _mentalExpertService = mentalExpertService;
        }

        [HttpGet("shares-per-user")]
        public async Task<Response> GetSharesPerUser([FromQuery] ExpertSearchContentDto query)
        {
            return await _mentalExpertService.GetSharesPerUser(query);
        }

        [HttpPost("give-assignment")]
        public async Task<Response> CreateAssignment([FromForm] CreateAssignmentDto request)
        {
            return await _mentalExpertService.CreateAssignment(request);
        }

    }
}
