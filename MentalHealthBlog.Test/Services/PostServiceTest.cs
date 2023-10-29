﻿using FluentAssertions;
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
        public async Task Add_ReturnNonCreatedNewPost(string Title, string Content, int userId)
        {
            //Arrange
            var post = new Post(Title, Content, userId);
            //Act
            var newPost = await _postService.Add(post);

            //Assert
            newPost.Should().BeOfType(typeof(Post));
            newPost.Should().BeEquivalentTo(new Post());
            newPost.Should().NotBeNull();
        }

        [Theory]
        [MemberData(memberName: nameof(Data.PostMethodsValidTestData), MemberType = typeof(Data))]
        public async Task Add_ReturnCreatedPost(string Title, string Content, int userId)
        {
            //Arrange
            var post = new Post(Title, Content, userId);

            //Act
            var newPost = await _postService.Add(post);

            //Assert
            newPost.Should().BeEquivalentTo(post);
            newPost.Should().NotBeNull();
            newPost.Should().BeOfType(typeof(Post));
            newPost.Content.Should().BeEquivalentTo(Content);
        }
        #endregion

    }
}