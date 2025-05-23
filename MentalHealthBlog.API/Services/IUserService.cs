﻿using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Services
{
    public interface IUserService
    {
        Task<Response> GetByIdAsync(int id);
        Task<Response> Register(CreateUserDto newUserRequest);
        Task<Response> Login(UserLoginDto loginCredentials);
        Task<Response> RefreshAccessToken(string refreshToken);
        Task<Response> GetRoles();
        Task<Response> Logout(LogoutDto logoutRequest);
    }
}
