using MentalHealthBlog.API.ExtensionMethods.ExtensionPostClass;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlogAPI.Services
{
    enum PostServiceLogTypes
    {
        POST_NULL,
        POSTS_SUCCESS,
        POSTS_FAILED
    }

    public class PostService : IPostService
    {
        private readonly DataContext _context;
        private readonly ILogger<PostService> _postServiceLogger;

        public PostService(DataContext context, ILogger<PostService> postServiceLogger)
        {
            _context = context;
            _postServiceLogger = postServiceLogger;
        }
        public async Task<IEnumerable<Post>> GetPosts()
        {
            try
            {
                var posts = await _context.Posts.ToListAsync();
                if (posts is null)
                {
                    _postServiceLogger.LogWarning($"GET: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new List<Post>();
                }
                _postServiceLogger.LogInformation($"GET: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return posts;
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new List<Post>();
            }
        }

        public async Task<Post> GetById(int id)
        {
            try
            {
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"GET/id: {PostServiceLogTypes.POST_NULL}");
                    return new Post();
                }
                _postServiceLogger.LogInformation($"GET/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return searched;
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Post();
            }
        }

        public async Task<Post> Add(Post post)
        {
            try
            {
                if (post.IsNullOrEmpthy())
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Post();
                }
                var newPost = await _context.Posts.AddAsync(post);
                if (newPost is null)
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Post();
                }
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"POST: {PostServiceLogTypes.POSTS_SUCCESS}");
                return newPost.Entity;
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"POST: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Post();
            }
        }
        public async Task<Post> Update(int id, Post post)
        {
            try
            {
                if (post.IsNullOrEmpthy())
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Post();
                }
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Post();
                }
                searched.Id = id;
                searched.Title = post.Title;
                searched.Content = post.Content;
                searched.UserId = post.UserId;
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"PUT/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return searched;
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"PUT/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Post();
            }

        }

        public async Task<Post> Delete(int id)
        {
            try
            {
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"DELETE/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Post();
                }
                _context.Posts.Remove(searched);
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"DELETE/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return searched;
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"DELETE/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Post();
            }
        }
    }
}
