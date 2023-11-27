using FluentAssertions;
using MentalHealthBlog.API.ExtensionMethods.ExtensionUserClass;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using MentalHealthBlog.API.Utils;
using MentalHealthBlog.Test.Moq;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace MentalHealthBlog.Test.Services
{
    public class UserServiceTest
    {
        private readonly UserService _userService;
        private readonly DataContext _context = DataContextTestHelper.LoadDataContext();
        private readonly Mock<ILogger<UserService>> _userServiceLogger = new Mock<ILogger<UserService>>();
        private readonly Mock<IOptions<AppSettings>> _optionAppSettings = new Mock<IOptions<AppSettings>>();
        private readonly User user = new User();
        public UserServiceTest()
        {
            _userService = new UserService(_context, _optionAppSettings.Object, _userServiceLogger.Object);
        }

        #region REGISTER

        [Theory]
        [InlineData("test", "test")]
        [InlineData("test_999", "test_999")]
        public async void Register_ReturnNewUser(string username, string password)
        {
            //Arrange 

            //Act
            Response response = await _userService.Register(username, password);
            UserResponseDto user = response.ServiceResponseObject.As<UserResponseDto>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status201Created);
            user.Should().NotBeNull();
            user.Should().BeOfType<UserResponseDto>();
            user.Id.Should().BeGreaterThanOrEqualTo(3);
        }

        [Theory]
        [InlineData(" ", " ")]
        [InlineData(" ", "test_03")]
        [InlineData("test_03", " ")]
        [InlineData("", "")]
        [InlineData("", "test_03")]
        [InlineData("test_03", "")]
        public async void Register_ReturnNotCreatedInvalidData(string username, string password)
        {
            //Arrange 

            //Act
            Response response = await _userService.Register(username, password);
            UserResponseDto user = response.ServiceResponseObject.As<UserResponseDto>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
        }

        [Theory]
        [InlineData("test_01", "test_01")]
        [InlineData("test_03", "test_03")]
        public async void Register_ReturnExistingUser(string username, string password)
        {
            //Arrange
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            var existingUser = dbUser is not null;

            //Act
            Response response = await _userService.Register(username, password);
            UserResponseDto user = response.ServiceResponseObject.As<UserResponseDto>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
            existingUser.Should().BeTrue();
        }

        #endregion

        #region LOGIN

        [Theory]
        [InlineData("", "")]
        [InlineData("test_03", "")]
        [InlineData("", "test_03")]
        [InlineData(" ", " ")]
        [InlineData("test_03", " ")]
        [InlineData(" ", "test_03")]
        public async void Login_ReturnsNewUserInvalidCredentials(string username, string password)
        {
            //Arrange
            var loginCredentials = new UserLoginDto();
            loginCredentials.Username = username;
            loginCredentials.Password = password;

            //Act
            Response response = await _userService.Login(loginCredentials);
            UserResponseDto loggedUser = response.ServiceResponseObject.As<UserResponseDto>();

            if (!user.IsNotValid(username, password))
            {
                var validCredentials = await _userService.VerifyCredentials(loginCredentials);

                //Assert
                response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
                validCredentials.Should().BeFalse();
                loggedUser.Should().NotBeNull();
                loggedUser.Should().BeOfType<object>();
                loggedUser.Should().BeEquivalentTo(new object());
            }
        }

        [Theory]
        [InlineData("test_01", "test_01")]
        [InlineData("test_03", "test_03")]
        public async void Login_ReturnsIsAuthenticatedWithCorrectCredentials(string username, string password)
        {
            //Arrange
            var loginCredentials = new UserLoginDto();
            loginCredentials.Username = username;
            loginCredentials.Password = password;

            //Act
            var loggedUser = await _userService.VerifyCredentials(loginCredentials);

            //Assert
            loggedUser.Should().BeTrue();
        }

        [Theory]
        [InlineData("test_01","test_03")]
        [InlineData("test_03","test_01")]
        public async void Login_ReturnsIsNotAuthenticatedWithIncorrectCredentials(string username, string password)
        {
            //Arrange
            var loginCredentials = new UserLoginDto();
            loginCredentials.Username = username;
            loginCredentials.Password = password;

            //Act 
            var loggedUser = await _userService.VerifyCredentials(loginCredentials);

            //Assert
            loggedUser.Should().BeFalse();
        }

        #endregion
    }
}
