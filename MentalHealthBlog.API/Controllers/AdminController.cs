using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
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

        [HttpGet("new-request")]
        public async Task<Response> GetNewRegisteredExperts()
        {
            return await _adminService.GetNewRegisteredExperts();
        }
    }
}
