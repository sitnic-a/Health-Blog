using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            this._userService = userService;
        }

        [HttpPost("register")]
        public async Task<Response> Register([FromForm] CreateUserDto newUserRequest)
        {
            return await _userService.Register(newUserRequest);
        }

        [HttpPost("login")]
        public async Task<Response> Login([FromBody] UserLoginDto loginCredentials)
        {
            return await _userService.Login(loginCredentials);
        }

        [HttpGet("roles")]
        public async Task<Response> GetDbRoles()
        {
            return await _userService.GetRoles();
        }
    }
}
