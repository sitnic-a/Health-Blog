using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;
using MentalHealthBlogAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        [Authorize]
        public async Task<Response> GetAllPosts()
        {
            return await _postService.GetPosts();
        }

        [HttpGet("{id}")]
        public async Task<Response> GetById(int id)
        {
            return await _postService.GetById(id);
        }

        [HttpPost]
        public async Task<Response> AddPost([FromBody] CreatePostDto post)
        {
            return await _postService.Add(post);
        }

        [HttpPut("{id}")]
        public async Task<Response> UpdatePost(int id, [FromBody] Post post)
        {
            return await _postService.Update(id, post);
        }

        [HttpDelete("{id}")]
        public async Task<Response> DeletePost(int id)
        {
            return await _postService.Delete(id);
        }
    }
}
