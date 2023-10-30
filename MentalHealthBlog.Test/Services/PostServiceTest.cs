using FluentAssertions;
using MentalHealthBlog.Test.Moq;
using MentalHealthBlog.Test.TestData;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using MentalHealthBlogAPI.Services;
using Microsoft.Extensions.Logging;
using Moq;

namespace MentalHealthBlog.Test.PostTest
{
    public class PostServiceTest
    {
        private readonly Mock<ILogger<PostService>> _postServiceLogger = new Mock<ILogger<PostService>>();
        private readonly DataContext _context = DataContextTestHelper.LoadDataContext();
        private readonly PostService _postService;
        public PostServiceTest()
        {
            _postService = new PostService(_context, _postServiceLogger.Object);
        }

        #region GET

        [Fact]
        public async void GetPosts_ReturnsNonNull()
        {
            //Arrange

            //Act
            IEnumerable<Post> posts = await _postService.GetPosts();
            var numberOfPosts = posts.Count();

            //Assert
            posts.Should().NotBeNull();
            Assert.Equal(5, numberOfPosts);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(5)]
        public async Task GetPostById_ReturnNonNull(int id)
        {
            //Arrange

            //Act
            var dbPost = await _postService.GetById(id);

            //Assert
            dbPost.Should().NotBeNull();
            dbPost.Should().NotBeOfType<User>();
            dbPost.Should().BeOfType<Post>();
            Assert.Contains("Mocked", dbPost.Title, StringComparison.OrdinalIgnoreCase);
            Assert.Contains("Mocked", dbPost.Title, StringComparison.OrdinalIgnoreCase);
        }

        [Theory]
        [InlineData(null)]
        [InlineData(6)]
        public async Task GetById_ReturnNonExistingElementAsNewPost(object value)
        {
            //Arrange
            var id = Convert.ToInt32(value);

            //Act
            var dbPost = await _postService.GetById(id);

            //Assert
            dbPost.Should().BeOfType(typeof(Post));
            dbPost.Should().BeEquivalentTo(new Post());
            dbPost.Should().NotBeNull();
        }

        #endregion

        #region POST

        [Theory]
        [MemberData(memberName: nameof(Data.PostMethodsInvalidTestData), MemberType = typeof(Data))]
        public async Task Add_ReturnNonCreatedNewPost(string title, string content, int userId)
        {
            //Arrange
            var post = new Post(title, content, userId);
            //Act
            var newPost = await _postService.Add(post);

            //Assert
            newPost.Should().BeOfType(typeof(Post));
            newPost.Should().BeEquivalentTo(new Post());
            newPost.Should().NotBeNull();
        }

        [Theory]
        [MemberData(memberName: nameof(Data.PostMethodsValidTestData), MemberType = typeof(Data))]
        public async Task Add_ReturnCreatedPost(string title, string content, int userId)
        {
            //Arrange
            var post = new Post(title, content, userId);

            //Act
            var newPost = await _postService.Add(post);

            //Assert
            newPost.Should().BeEquivalentTo(post);
            newPost.Should().NotBeNull();
            newPost.Should().BeOfType(typeof(Post));
            newPost.Content.Should().BeEquivalentTo(content);
        }
        #endregion

        #region PUT

        [Theory]
        [MemberData(memberName: nameof(Data.UpdateMethodsInvalidData), MemberType = typeof(Data))]
        public async Task Update_ReturnNonUpdatedPost(int postId, string title, string content, int usedId)
        {
            //Arrange
            var dbPost = await _postService.GetById(postId);
            var post = new Post(title, content, usedId);

            //Act
            var updatedPost = await _postService.Update(postId, post);

            //Assert
            updatedPost.Should().BeOfType(typeof(Post));
            updatedPost.Should().BeEquivalentTo(new Post());
            updatedPost.Should().NotBeNull();
            updatedPost.Should().NotBeSameAs(dbPost);
        }

        [Theory]
        [MemberData(memberName:nameof(Data.UpdateMethodsValidData), MemberType =typeof(Data))]
        public async Task Update_ReturnsUpdatedPost(int postId, string title, string content, int userId)
        {
            //Arrange
            var dbPost = await _postService.GetById(postId);
            var post = new Post(title, content, userId);

            //Act
            var updatedPost = await _postService.Update(postId, post);

            //Assert
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
            var dbPost = await _postService.Delete(id);

            //Assert
            dbPost.Should().NotBeNull();
            dbPost.Should().BeEquivalentTo(new Post());
            dbPost.Should().BeOfType(typeof(Post));
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(5)]
        public async Task Delete_ReturnDeletedPost(int id)
        {
            //Arrange
            var dbPost = await _postService.GetById(id);

            //Act
            var deletedPost = await _postService.Delete(id);

            //Assert
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
