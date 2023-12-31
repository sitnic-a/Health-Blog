﻿using MentalHealthBlog.API.ExtensionMethods.ExtensionUserClass;
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
        public async Task<Response> Register(string username, string password)
        {
            try
            {
                if (user.IsNotValid(username, password))
                {
                    _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", new {Username= username, Password = password});
                    return new Response(new object(), StatusCodes.Status400BadRequest, UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString());
                }
                var dbUsers = _context.Users;
                var existingUser = await dbUsers.SingleOrDefaultAsync(u => u.Username == username) is not null;
                if (existingUser)
                {
                    _userLoggerService.LogWarning($"REGISTER: {UserServiceLogTypes.USER_EXISTS.ToString()}", existingUser);
                    return new Response(new object(), StatusCodes.Status400BadRequest, UserServiceLogTypes.USER_EXISTS.ToString());
                }
                var salt = user.GenerateSalt(__KEYSIZE__);
                var hash = user.HashPassword(password, salt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
                user.Username = username;
                user.PasswordSalt = salt;
                user.PasswordHash = hash;

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                _userLoggerService.LogInformation($"REGISTER: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", user);
                return new Response(new UserResponseDto(user.Id, user.Username), StatusCodes.Status201Created, UserServiceLogTypes.USER_SUCCESFULL.ToString());

            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString());
            }
        }

        public async Task<Response> Login(UserLoginDto loginCredentials)
        {
            try
            {
                if (user.IsNotValid(loginCredentials.Username, loginCredentials.Password))
                {
                    _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", loginCredentials);
                    return new Response(new object(), StatusCodes.Status400BadRequest, UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString());
                }
                var jwtMiddleware = new JWTService(_options);
                var authenticated = await VerifyCredentials(loginCredentials);
                var dbUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginCredentials.Username);
                if (authenticated && dbUser is not null)
                {
                    var token = jwtMiddleware.GenerateToken(dbUser);
                    if (String.IsNullOrEmpty(token))
                    {
                        _userLoggerService.LogError($"LOGIN: {UserServiceLogTypes.USER_TOKEN_NOT_CREATED.ToString()}", token);
                        return new Response(new object(), StatusCodes.Status403Forbidden, UserServiceLogTypes.USER_TOKEN_NOT_CREATED.ToString());
                    }
                    var responseUser = new UserResponseDto(dbUser.Id, dbUser.Username, token);
                    _userLoggerService.LogInformation($"LOGIN: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", responseUser);
                    return new Response(responseUser, StatusCodes.Status200OK, UserServiceLogTypes.USER_SUCCESFULL.ToString());
                }
                _userLoggerService.LogWarning($"LOGIN: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}",$"DB USER: {dbUser}");
                return new Response(new object(), StatusCodes.Status400BadRequest, UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString());
            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"LOGIN: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString());
            }
        }

        public async Task<bool> VerifyCredentials(UserLoginDto loginCredentials)
        {
            var dbUsers = _context.Users;
            var existingUser = await dbUsers.SingleOrDefaultAsync(u => u.Username == loginCredentials.Username);
            if (existingUser is not null)
            {
                var hashToCompare = user.HashPassword(loginCredentials.Password, existingUser.PasswordSalt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
                return CryptographicOperations.FixedTimeEquals(Convert.FromBase64String(hashToCompare), Convert.FromBase64String(existingUser.PasswordHash));
            }
            return false;
        }

    }
}
