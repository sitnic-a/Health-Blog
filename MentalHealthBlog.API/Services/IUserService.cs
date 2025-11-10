using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.JsonPatch;

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
        Task<Response> ChangePassword(ChangePasswordDto changePasswordRequest);
        Task<Response> ChangeIsUsingForTheFirstTime(int id, JsonPatchDocument<User> patchDocument);
    }
}
