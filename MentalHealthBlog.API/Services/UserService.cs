using MentalHealthBlog.API.ExtensionMethods.ExtensionUserClass;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;

namespace MentalHealthBlog.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppSettings _optionsAppSettings;
        private readonly IOptions<AppSettings> _options;
        private readonly DataContext _context;
        private const int __KEYSIZE__ = 128;
        private const int __ITERATIONS = 350000;
        private HashAlgorithmName __HASHALGORITHM__ = HashAlgorithmName.SHA512;
        private User user = new();


        public UserService(DataContext context, IOptions<AppSettings> options)
        {
            _context = context;
            _optionsAppSettings = options.Value;
            _options = options;
        }
        public async Task<User> Register(string username, string password)
        {
            var dbUsers = _context.Users;
            var existingUser = await dbUsers.SingleOrDefaultAsync(u => u.Username == username) is not null;
            if (existingUser)
            {
                //Logger
                return new User();
            }
            var salt = user.GenerateSalt(__KEYSIZE__);
            var hash = user.HashPassword(password, salt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
            user.Username = username;
            user.PasswordSalt = salt;
            user.PasswordHash = hash;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<UserResponseDto> Login(string username, string password)
        {
            var jwtMiddleware = new JWTService(_options);
            var authenticated = await VerifyCredentials(username, password);
            var dbUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            if (authenticated && dbUser is not null)
            {
                var token = jwtMiddleware.GenerateToken(dbUser);
                var responseUser = new UserResponseDto(dbUser.Id, dbUser.Username, token);
                return responseUser;
            }
            return new UserResponseDto();
        }

        public async Task<bool> VerifyCredentials(string username, string password)
        {
            var dbUsers = _context.Users;
            var existingUser = await dbUsers.SingleOrDefaultAsync(u => u.Username == username);
            if (existingUser is not null)
            {
                var hashToCompare = user.HashPassword(password, existingUser.PasswordSalt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
                return CryptographicOperations.FixedTimeEquals(Convert.FromBase64String(hashToCompare), Convert.FromBase64String(existingUser.PasswordHash));
            }
            return false;
        }

    }
}
