using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        [Authorize(Roles ="Administrator")]
        public async Task<Response> Get([FromQuery] SearchUserDto? query = null)
        {
            return await _adminService.Get(query);
        }

        [HttpPost("new-request")]
        [Authorize(Roles="Administrator")]
        public async Task<Response> GetNewRegisteredExperts([FromBody] SearchExpertDto? query = null)
        {
            return await _adminService.GetNewRegisteredExperts(query);
        }

        [HttpPatch("approval")]
        [Authorize(Roles ="Administrator")]
        public async Task<Response> SetRegisteredExpertStatus(RegisterExpertPatchDto patchDto)
        {
            return await _adminService.SetRegisteredExpertStatus(patchDto);
        }

        [HttpDelete("{userId}")]
        [Authorize(Roles ="Administrator")]
        public async Task<Response> RemoveUserById(int userId)
        {
            return await _adminService.RemoveUserById(userId);
        }
    }
}
