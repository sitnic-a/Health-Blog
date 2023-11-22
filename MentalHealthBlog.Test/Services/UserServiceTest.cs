using FluentAssertions;
using MentalHealthBlog.API.ExtensionMethods.ExtensionUserClass;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using MentalHealthBlog.API.Utils;
using MentalHealthBlog.Test.Moq;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
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

        [Theory]
        [InlineData("test", "test")]
        [InlineData("test_999", "test_999")]
        public async void Register_ReturnNewUser(string username, string password)
        {
            //Arrange 

            //Act
            var user = await _userService.Register(username, password);

            //Assert
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
        public async void Register_ReturnNotCreatedNewUser(string username, string password)
        {
            //Arrange 

            //Act
            var user = await _userService.Register(username, password);

            //Assert
            user.Should().NotBeNull();
            user.Should().BeOfType<UserResponseDto>();
            user.Should().BeEquivalentTo(new UserResponseDto());
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
            var user = await _userService.Register(username, password);

            //Assert
            existingUser.Should().BeTrue();
            user.Should().NotBeNull();
            user.Should().BeOfType<UserResponseDto>();
        }

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

            //Act
            var loggedUser = await _userService.Login(username, password);
            if (!user.IsNotValid(username, password))
            {
                var validCredentials = await _userService.VerifyCredentials(username, password);

                //Assert
                validCredentials.Should().BeFalse();
                loggedUser.Should().NotBeNull();
                loggedUser.Should().BeOfType<UserResponseDto>();
                loggedUser.Should().BeEquivalentTo(new UserResponseDto());
            }
        }

        [Theory]
        [InlineData("test_01", "test_01")]
        [InlineData("test_03", "test_03")]
        public async void Login_ReturnsIsAuthenticatedWithCorrectCredentials(string username, string password)
        {
            //Arrange
            
            //Act
            var loggedUser = await _userService.VerifyCredentials(username, password);

            //Assert
            loggedUser.Should().BeTrue();
        }

        [Theory]
        [InlineData("test_01","test_03")]
        [InlineData("test_03","test_01")]
        public async void Login_ReturnsIsNotAuthenticatedWithIncorrectCredentials(string username, string password)
        {
            //Arrange

            //Act 
            var loggedUser = await _userService.VerifyCredentials(username, password);

            //Assert
            loggedUser.Should().BeFalse();
        }

    }
}
