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

        [HttpPost("regular-users-by-therapy-status")]
        [Authorize(Roles = "Psychologist / Psychotherapist")]
        public async Task<Response> GetRegularUsersByTherapyStatus(Models.ResourceRequest.TherapyRequestDto request)
        {
            return await _mentalExpertService.GetRegularUsersByTherapyStatus(request);
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
        public async Task<Response> SendInviteToUser([FromBody] InviteDto request)
        {
            return await _mentalExpertService.SendInviteToUser(request);
        }

        [HttpGet("/invite/{id}")]
        public async Task<Response> Invite(string id)
        {
            try
            {
                var invitationResponse = await _mentalExpertService.GetInvitationById(id);
                var invitation = invitationResponse.ServiceResponseObject as TherapyInvite;

                if (invitation != null)
                {
                    Response.Cookies.Append("isMentalHealthExpert", "false", new CookieOptions()
                    {
                        Expires = DateTime.UtcNow.AddDays(2)
                    });

                    Response.Cookies.Append("therapyInvitationId", invitation.Id, new CookieOptions()
                    {
                        Expires = DateTime.UtcNow.AddDays(2)
                    });

                    Response.Cookies.Append("therapyInvitationSentById", $"{invitation.MentalHealthExpertId}", new CookieOptions()
                    {
                        Expires = DateTime.UtcNow.AddDays(2)
                    });

                    _mentalExpertLoggerService.LogInformation($"INVITE/[id]: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                    HttpContext.Response.Redirect("http://localhost:3000/register");
                    return new Response(invitation, StatusCodes.Status200OK, MentalExpertServiceLogTypes.SUCCESS.ToString());
                }

                _mentalExpertLoggerService.LogWarning($"INVITE/[id]: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Invitation not found!");
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"INVITE/[id]: {e.Message}");
                throw;
            }
        }

    }
}
