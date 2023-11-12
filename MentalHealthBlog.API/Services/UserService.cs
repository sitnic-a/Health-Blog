using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;

        public UserService(DataContext context)
        {
            this._context = context;
        }
        public Task<User> RegisterUser(string username, string password)
        {
            throw new NotImplementedException();
        }

        public Task<User> Login(string username, string password)
        {
            throw new NotImplementedException();
        }

    }
}
