using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlogAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly DataContext _context;

        public PostController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Post>> GetAllPosts()
        {
            var posts = await _context.Posts.ToListAsync();
            return posts;
        }

        [HttpGet("{id}")]
        public async Task<Post> GetById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            return post != null ? post : new Post(string.Empty, "Post doens't exist", 0);
        }
               
    }
}
