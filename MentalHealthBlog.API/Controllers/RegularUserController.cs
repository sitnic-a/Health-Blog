using iText.Layout.Element;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegularUserController : ControllerBase
    {
        private readonly IRegularUserService _regularUserService;
        public RegularUserController(IRegularUserService regularUserService)
        {
            _regularUserService = regularUserService;
        }

        [HttpGet("shares-per-mental-health-expert")]
        [Authorize]
        public async Task<Response> GetSharesPerMentalHealthExpert([FromQuery] RegularUserSearchContentDto query)
        {
            return await _regularUserService.GetSharesPerMentalHealthExpert(query);
        }

        [HttpGet("recent")]
        [Authorize]
        public async Task<Response> GetRecentSharesPerMentalHealthExpert([FromQuery] RegularUserSearchContentDto query)
        {
            return await _regularUserService.GetRecentSharesPerMentalHealthExpert(query);
        }

        [HttpDelete("revoke")]
        [Authorize]
        public async Task<Response> RevokeContentPermission([FromBody] RegularUserPermissionDto request)
        {
            return await _regularUserService.RevokeContentPermission(request);
        }
    }
}
