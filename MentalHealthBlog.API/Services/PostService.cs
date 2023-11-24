using MentalHealthBlog.API.ExtensionMethods.ExtensionPostClass;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlogAPI.Services
{
    enum PostServiceLogTypes
    {
        POST_NULL,
        POST_INVALID_DATA,
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
        public async Task<Response> GetPosts()
        {
            try
            {
                var posts = await _context.Posts.ToListAsync();
                if (posts is null)
                {
                    _postServiceLogger.LogWarning($"GET: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString()); ;
                }
                _postServiceLogger.LogInformation($"GET: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(posts, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString()); ;
            }
        }

        public async Task<Response> GetById(int id)
        {
            try
            {
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"GET/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
                }
                _postServiceLogger.LogInformation($"GET/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(searched, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString()); ;
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString()); ;
            }
        }

        public async Task<Response> Add(Post post)
        {
            try
            {
                if (post.IsNullOrEmpthy())
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_INVALID_DATA.ToString()}");
                    return new Response(new object(), StatusCodes.Status400BadRequest, PostServiceLogTypes.POST_INVALID_DATA.ToString());
                }
                var newPost = await _context.Posts.AddAsync(post);
                if (newPost is null)
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
                }
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"POST: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(newPost.Entity, StatusCodes.Status201Created, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"POST: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
            }
        }
        public async Task<Response> Update(int id, Post post)
        {
            try
            {
                if (post.IsNullOrEmpthy())
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_INVALID_DATA.ToString()}");
                    return new Response(new object(), StatusCodes.Status400BadRequest, PostServiceLogTypes.POST_INVALID_DATA.ToString());
                }
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
                }
                searched.Id = id;
                searched.Title = post.Title;
                searched.Content = post.Content;
                searched.UserId = post.UserId;
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"PUT/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(searched, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"PUT/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
            }

        }

        public async Task<Response> Delete(int id)
        {
            try
            {
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"DELETE/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
                }
                _context.Posts.Remove(searched);
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"DELETE/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(searched, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"DELETE/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
            }
        }
    }
}
