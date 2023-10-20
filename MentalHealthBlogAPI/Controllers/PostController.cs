using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using MentalHealthBlogAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlogAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly ILogger _logger;

        public PostController(IPostService postService, ILogger logger)
        {
            _postService = postService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<Post>> GetAllPosts()
        {
            try
            {
                _logger.LogInformation("Posts");
                return await _postService.GetPosts();
            }
            catch (Exception e)
            {
                _logger.LogError("Get posts failed", e);
                throw;
            }
        }

        [HttpGet("{id}")]
        public async Task<Post> GetById(int id)
        {
            try
            {
                _logger.LogInformation("Post Id");
                return await _postService.GetById(id);
            }
            catch (Exception e)
            {
                _logger.LogError("Get post failed", e);
                throw;
            }
        }

    }
}
