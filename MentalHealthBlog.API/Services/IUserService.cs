using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Services
{
    public interface IUserService
    {
        Task<UserResponseDto> Register(string username, string password);
        Task<UserResponseDto> Login(string username, string password);
    }
}
