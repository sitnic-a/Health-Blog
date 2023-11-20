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

    enum UserServiceLogTypes
    {
        USER_EXISTS,
        USER_INVALID_DATA_OR_SOMETHING_ELSE,
        USER_SUCCESFULL,
        USER_TOKEN_NOT_CREATED
    }
    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _userLoggerService;
        private readonly AppSettings _optionsAppSettings;
        private readonly IOptions<AppSettings> _options;
        private readonly DataContext _context;
        private const int __KEYSIZE__ = 128;
        private const int __ITERATIONS = 350000;
        private HashAlgorithmName __HASHALGORITHM__ = HashAlgorithmName.SHA512;
        private User user = new();


        public UserService(DataContext context, IOptions<AppSettings> options, ILogger<UserService> userLoggerService)
        {
            _context = context;
            _optionsAppSettings = options.Value;
            _options = options;
            _userLoggerService = userLoggerService;
        }
        public async Task<UserResponseDto> Register(string username, string password)
        {
            try
            {
                var dbUsers = _context.Users;
                var existingUser = await dbUsers.SingleOrDefaultAsync(u => u.Username == username) is not null;
                if (existingUser)
                {
                    _userLoggerService.LogWarning($"REGISTER: {UserServiceLogTypes.USER_EXISTS.ToString()}", existingUser);
                    return new UserResponseDto();
                }
                var salt = user.GenerateSalt(__KEYSIZE__);
                var hash = user.HashPassword(password, salt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
                user.Username = username;
                user.PasswordSalt = salt;
                user.PasswordHash = hash;

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                _userLoggerService.LogInformation($"REGISTER: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", user);
                return new UserResponseDto(user.Id, user.Username);

            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", e);
                return new UserResponseDto();
            }
        }

        public async Task<UserResponseDto> Login(string username, string password)
        {
            try
            {
                var jwtMiddleware = new JWTService(_options);
                var authenticated = await VerifyCredentials(username, password);
                var dbUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
                if (authenticated && dbUser is not null)
                {
                    var token = jwtMiddleware.GenerateToken(dbUser);
                    if (String.IsNullOrEmpty(token))
                    {
                        _userLoggerService.LogError($"LOGIN: {UserServiceLogTypes.USER_TOKEN_NOT_CREATED.ToString()}", token);
                        return new UserResponseDto();
                    }
                    var responseUser = new UserResponseDto(dbUser.Id, dbUser.Username, token);
                    _userLoggerService.LogInformation($"LOGIN: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", responseUser);
                    return responseUser;
                }
                _userLoggerService.LogWarning($"LOGIN: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}",$"DB USER: {dbUser}");
                return new UserResponseDto();
            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"LOGIN: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", e);
                return new UserResponseDto();
            }
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
