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

        [HttpPost("register/{username}/{password}")]
        public async Task<User> Register(string username, string password)
        {
            return await _userService.Register(username, password);
        }

        [HttpPost("login/{username}/{password}")]
        public async Task<UserResponseDto> Login(string username, string password)
        {
            return await _userService.Login(username, password);
        }
    }
}
