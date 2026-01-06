using MentalHealthBlog.API.Exceptions;
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
        private readonly IHttpContextAccessor _httpContext;
        ILogger<IMentalExpertService> _mentalExpertLoggerService;
        public MentalExpertController(IMentalExpertService mentalExpertService, IHttpContextAccessor httpContext, ILogger<IMentalExpertService> mentalExpertLoggerService)
        {
            _mentalExpertService = mentalExpertService;
            _httpContext = httpContext;
            _mentalExpertLoggerService = mentalExpertLoggerService;
        }

        [HttpPost("experts")]
        public async Task<Response> GetExperts([FromBody] SearchExpertDto? request = null)
        {
            return await _mentalExpertService.GetMentalHealthExperts(request);
        }


        [HttpGet("shares-per-user")]
        [Authorize(Roles = "Psychologist / Psychotherapist")]
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
        [Authorize(Roles = "Psychologist / Psychotherapist")]
        public async Task<Response> CreateAssignment([FromBody] CreateAssignmentDto request)
        {
            return await _mentalExpertService.CreateAssignment(request);
        }

        [HttpPost("invite/user")]
        [Authorize(Roles = "Psychologist / Psychotherapist")]
        public async Task SendInviteToUser([FromBody] InviteDto request)
        {
            await _mentalExpertService.SendInviteToUser(request);
        }

        [HttpGet("invite/{id}")]
        public async Task<Response> Invite(Guid id)
        {
            try
            {
                var invitationResponse = await _mentalExpertService.GetInvitationById(id);
                var invitation = invitationResponse.ServiceResponseObject as TherapyInvite;

                if (invitation != null)
                {
                    Response.Cookies.Append("IsMentalHealthExpert", "false", new CookieOptions()
                    {
                        Expires = DateTime.UtcNow.AddDays(2)
                    });

                    Response.Cookies.Append("MentalHealthExpertId", $"{invitation.MentalHealthExpertId}", new CookieOptions()
                    {
                        Expires = DateTime.UtcNow.AddDays(2)
                    });

                    _mentalExpertLoggerService.LogInformation($"INVITE/[id]: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                    HttpContext.Response.Redirect("register");
                }

                _mentalExpertLoggerService.LogWarning($"INVITE/[id]: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Invitation not found!");
            }
            catch (Exception)
            {

                throw;
            }
        }

    }
}
