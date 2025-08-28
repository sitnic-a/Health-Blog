using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Therapy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TherapyController : ControllerBase
    {
        private readonly ITherapyRequestService _therapyRequestService;
        public TherapyController(ITherapyRequestService therapyRequestService, ILogger<ITherapyRequestService> therapyRequestLoggerService)
        {
            _therapyRequestService = therapyRequestService;
        }

        [HttpPost("requests-for-mental-health-experts")]
        public async Task<Response> GetRequestsForMentalHealthExperts([FromBody] SearchTherapyRequestDto? query =null)
        {
            return await _therapyRequestService.GetRequestsForMentalHealthExpert(query);
        }

        [HttpPost("my-experts")]
        public async Task<Response> GetUsersMentalHealthExperts([FromBody] SearchTherapyRequestDto? query = null)
        {
            return await _therapyRequestService.GetUsersMentalHealthExperts(query);
        }

        [HttpPut("change-request-status")]
        public async Task<Response> ChangeRequestStatus([FromBody] Models.ResourceRequest.TherapyRequestDto request)
        {
            return await _therapyRequestService.ChangeRequestStatus(request);
        }

        [HttpDelete]
        public async Task<Response> StopSharing(Models.ResourceRequest.TherapyRequestDto request)
        {
            return await _therapyRequestService.StopSharing(request);
        }
    }
}
