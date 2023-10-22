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

        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<IEnumerable<Post>> GetAllPosts()
        {
            try
            {
                return await _postService.GetPosts();
            }
            catch (Exception e)
            {
                throw;
            }
        }

        [HttpGet("{id}")]
        public async Task<Post> GetById(int id)
        {
            try
            {
                return await _postService.GetById(id);
            }
            catch (Exception e)
            {
                throw;
            }
        }

        [HttpPost]
        public async Task<Post> AddPost([FromBody] Post post)
        {
            return await _postService.Add(post);
        }

        [HttpPut("{id}")]
        public async Task<Post> UpdatePost(int id, [FromBody]Post post)
        {
            return await _postService.Update(id, post);
        }
        

    }
}
