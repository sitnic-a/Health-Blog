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

        [HttpGet("shares-per-mental-health-expert")]
        public async Task<Response> GetSharesPerMentalHealthExpert()
        {
            return await _mentalExpertService.GetSharesPerMentalHealthExpert();
        }

    }
}
