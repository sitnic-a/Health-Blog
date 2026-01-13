using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Therapy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TherapyController : ControllerBase
    {
        private readonly ITherapyRequestService _therapyRequestService;
        private readonly ITherapyInviteService _therapyInviteService;
        public TherapyController(ITherapyRequestService therapyRequestService, ITherapyInviteService therapyInviteService)
        {
            _therapyRequestService = therapyRequestService;
            _therapyInviteService = therapyInviteService;
        }

        [HttpPost("requests-for-mental-health-experts")]
        [Authorize(Roles = "Psychologist / Psychotherapist")]
        public async Task<Response> GetRequestsForMentalHealthExperts([FromBody] SearchTherapyRequestDto? query = null)
        {
            return await _therapyRequestService.GetRequestsForMentalHealthExpert(query);
        }

        [HttpPost("my-experts")]
        [Authorize(Roles = "User")]
        public async Task<Response> GetUsersMentalHealthExperts([FromBody] SearchTherapyRequestDto? query = null)
        {
            return await _therapyRequestService.GetMyExperts(query);
        }

        [HttpPut("change-request-status")]
        [Authorize(Roles = "Psychologist / Psychotherapist, User")]
        public async Task<Response> ChangeRequestStatus([FromBody] Models.ResourceRequest.TherapyRequestDto request)
        {
            return await _therapyRequestService.ChangeRequestStatus(request);
        }

        [HttpDelete]
        [Authorize(Roles = "User")]
        public async Task<Response> StopSharing(Models.ResourceRequest.TherapyRequestDto request)
        {
            return await _therapyRequestService.StopSharing(request);
        }

        [HttpGet("regular-user-unnotified-automatic-connection")]
        [Authorize(Roles = "User")]
        public async Task<Response> GetRegularUserUnnotifiedAutomaticConnectionTherapyInvites([FromQuery] int regularUserId)
        {
            return await _therapyInviteService.GetRegularUserUnnotifiedAutomaticConnectionTherapyInvites(regularUserId);
        }

        [HttpPut("notified-about-automatic-connection/{regularUserId}")]
        [Authorize(Roles = "User")]
        public async Task<Response> MarkRegularUserAutomaticConnectionAsNotified(int regularUserId)
        {
            Task.Delay(200);
            return new Response();
        }
    }
}
