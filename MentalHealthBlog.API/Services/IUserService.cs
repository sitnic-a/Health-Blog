using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Services
{
    public interface IUserService
    {
        Task<User> RegisterUser(string username, string password);
        Task<User> Login(string username, string password);
    }
}
