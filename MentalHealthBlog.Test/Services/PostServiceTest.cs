using AutoMapper;
using FluentAssertions;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils.Mapper;
using MentalHealthBlog.Test.Moq;
using MentalHealthBlog.Test.TestData;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using MentalHealthBlogAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;

namespace MentalHealthBlog.Test.PostTest
{
    public class PostServiceTest
    {
        private readonly Mock<ILogger<PostService>> _postServiceLogger = new Mock<ILogger<PostService>>();
        private readonly IMapper _mapper;
        private readonly DataContext _context = DataContextTestHelper.LoadDataContext();
        private readonly PostService _postService;
        public PostServiceTest()
        {
            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new HealthBlogMapper());
            });
            IMapper mapper = mappingConfig.CreateMapper();
            _mapper = mapper;
            _postService = new PostService(_context, _mapper, _postServiceLogger.Object);
        }

        #region GET

        [Theory]
        [MemberData(memberName: nameof(Data.ValidSearchPostDto), MemberType = typeof(Data))]
        public async void GetPosts_ReturnsNonNull(int userId)
        {
            //Arrange
            SearchPostDto query = new SearchPostDto
            {
                UserId = userId
            };

            //Act
            Response response = await _postService.GetPosts(query);
            IEnumerable<Post> posts = _mapper.Map<IEnumerable<Post>>(response.ServiceResponseObject);
            var numberOfPosts = posts.Count();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status200OK);
            posts.Should().NotBeNull();
            Assert.Equal(3, numberOfPosts);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(5)]
        public async Task GetPostById_ReturnNonNull(int id)
        {
            //Arrange

            //Act
            Response response = await _postService.GetById(id);
            Post dbPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status200OK);
            dbPost.Should().NotBeNull();
            dbPost.Should().NotBeOfType<User>();
            dbPost.Should().BeOfType<Post>();
            Assert.Contains("Mocked", dbPost.Title, StringComparison.OrdinalIgnoreCase);
            Assert.Contains("Mocked", dbPost.Title, StringComparison.OrdinalIgnoreCase);
        }

        [Theory]
        [InlineData(null)]
        [InlineData(6)]
        public async Task GetById_ReturnNonExistingElement(object value)
        {
            //Arrange
            var id = Convert.ToInt32(value);

            //Act
            Response response = await _postService.GetById(id);

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status204NoContent);
        }

        #endregion

        #region POST

        [Theory]
        [MemberData(memberName: nameof(Data.PostMethodsInvalidTestData), MemberType = typeof(Data))]
        public async Task Add_ReturnNonCreatedNewPost(string title, string content, int userId)
        {
            //Arrange
            CreatePostDto post = new CreatePostDto
            {
                Title = title,
                Content = content,
                UserId = userId
            };

            //Act
            Response response = await _postService.Add(post);
            Post newPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
        }

        [Theory]
        [MemberData(memberName: nameof(Data.PostMethodsValidTestData), MemberType = typeof(Data))]
        public async Task Add_ReturnCreatedPost(string title, string content, int userId)
        {
            //Arrange
            CreatePostDto post = new CreatePostDto
            {
                Title = title,
                Content = content,
                UserId = userId,
                Tags = new List<string>()
            };

            //Act
            Response response = await _postService.Add(post);
            var newPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status201Created);
            newPost.Should().NotBeNull();
            newPost.Should().BeOfType(typeof(Post));
            newPost.Content.Should().BeEquivalentTo(post.Content);
        }
        #endregion

        #region PUT

        [Theory]
        [MemberData(memberName: nameof(Data.UpdateMethodInvalidFormRequest), MemberType = typeof(Data))]
        public async Task Update_ReturnNonUpdatedPostInvalidFormRequest(int postId, string title, string content, int userId)
        {
            //Arrange
            Response responseById = await _postService.GetById(postId);
            Post dbPost = responseById.ServiceResponseObject.As<Post>();
            var post = new Post(title, content, userId);

            //Act
            Response response = await _postService.Update(postId, post);
            Post updatedPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
        }

        [Theory]
        [MemberData(memberName: nameof(Data.UpdateMethodInvalidPostId), MemberType = typeof(Data))]
        public async Task Update_ReturnNonUpdatedPostInvalidPostId(int postId, string title, string content, int userId)
        {
            //Arrange
            Response responseById = await _postService.GetById(postId);
            Post dbPost = responseById.ServiceResponseObject.As<Post>();
            var post = new Post(title, content, userId);

            //Act
            Response response = await _postService.Update(postId, post);
            Post updatedPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status204NoContent);
        }

        [Theory]
        [MemberData(memberName: nameof(Data.UpdateMethodsValidData), MemberType = typeof(Data))]
        public async Task Update_ReturnsUpdatedPost(int postId, string title, string content, int userId)
        {
            //Arrange
            var post = new Post(title, content, userId);

            //Act
            Response response = await _postService.Update(postId, post);
            Post updatedPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status200OK);
            updatedPost.Should().NotBeNull();
            updatedPost.Should().BeOfType(typeof(Post));
            Assert.Equal(updatedPost.Title, post.Title);
            Assert.Equal(updatedPost.Content, post.Content);
            Assert.Equal(updatedPost.UserId, post.UserId);
        }

        #endregion

        #region DELETE

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(10)]
        public async Task Delete_ReturnsNonExistingNewPost(int id)
        {
            //Arrange

            //Act
            Response response = await _postService.Delete(id);
            Post dbPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status204NoContent);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(5)]
        public async Task Delete_ReturnDeletedPost(int id)
        {
            //Arrange
            Response responseGetById = await _postService.GetById(id);
            Post dbPost = responseGetById.ServiceResponseObject.As<Post>();

            //Act
            Response response = await _postService.Delete(id);
            Post deletedPost = response.ServiceResponseObject.As<Post>();

            //Assert
            response.StatusCode.Should().Be(StatusCodes.Status200OK);
            deletedPost.Should().NotBeNull();
            deletedPost.Should().BeOfType(typeof(Post));
            deletedPost.Should().NotBeEquivalentTo(new Post());
            Assert.Equal(deletedPost.Title, dbPost.Title);
            Assert.Equal(deletedPost.Content, dbPost.Content);
            Assert.Equal(deletedPost.UserId, dbPost.UserId);
        }

        #endregion
    }
}
