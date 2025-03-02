using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using MentalHealthBlog.API.Utils.SignalR;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IHubContext<AdminHub> _adminHubContext;
        private readonly IAdminService _adminService;

        public UserController(IUserService userService, IHubContext<AdminHub> adminHubContext, IAdminService adminService)
        {
            _userService = userService;
            _adminHubContext = adminHubContext;
            _adminService = adminService;
        }

        [HttpPost("register")]
        public async Task<Response> Register([FromForm] CreateUserDto newUserRequest)
        {
            var registeredUser = await _userService.Register(newUserRequest);
            var newlyRegisteredMentalHealthExperts = await _adminService.GetNewRegisteredExperts();
            var hubResult = _adminHubContext.Clients.All.SendAsync("GetNewRegisteredMentalHealthExperts", newlyRegisteredMentalHealthExperts);
            return registeredUser;
        }

        [HttpPost("login")]
        public async Task<Response> Login([FromBody] UserLoginDto loginCredentials)
        {
            var loggedUser = await _userService.Login(loginCredentials);
            var signedUserData = loggedUser.ServiceResponseObject as SignedUserDto;
            Response.Headers.Add("Access-Control-Allow-Credentials","true");

            Response.Cookies.Append("refreshToken", signedUserData.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddHours(1).AddMinutes(30),
                Domain = "localhost",
                SameSite = SameSiteMode.None,
                Secure = true,
            });
            return loggedUser;
        }

        [HttpGet("roles")]
        public async Task<Response> GetDbRoles()
        {
            return await _userService.GetRoles();
        }
    }
}
