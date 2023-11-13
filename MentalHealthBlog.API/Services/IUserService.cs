using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Services
{
    public interface IUserService
    {
        Task<User> Register(string username, string password);
        Task<User> Login(string username, string password);
    }
}
