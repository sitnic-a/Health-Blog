using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Services
{
    public interface IUserService
    {
        Task<Response> Register(string username, string password);
        Task<Response> Login(string username, string password);
    }
}
