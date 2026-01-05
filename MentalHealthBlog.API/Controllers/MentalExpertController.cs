using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost("experts")]
        public async Task<Response> GetExperts([FromBody] SearchExpertDto? request = null)
        {
            return await _mentalExpertService.GetMentalHealthExperts(request);
        }


        [HttpGet("shares-per-user")]
        [Authorize(Roles= "Psychologist / Psychotherapist")]
        public async Task<Response> GetSharesPerUser([FromQuery] ExpertSearchContentDto query)
        {
            return await _mentalExpertService.GetSharesPerUser(query);
        }

        [HttpGet("users-with-set-assignments")]
        [Authorize(Roles = "Psychologist / Psychotherapist")]
        public async Task<Response> GetUsersWithSetAssignments([FromQuery] ExpertSearchContentDto query)
        {
            return await _mentalExpertService.GetUsersWithSetAssignments(query);
        }

        [HttpPost("give-assignment")]
        [Authorize(Roles= "Psychologist / Psychotherapist")]
        public async Task<Response> CreateAssignment([FromBody] CreateAssignmentDto request)
        {
            return await _mentalExpertService.CreateAssignment(request);
        }

        [HttpPost("invite/user")]
        [Authorize(Roles= "Psychologist / Psychotherapist")]
        public async Task<Response> SendInviteToUser([FromBody] InviteDto request)
        {

        }

    }
}
