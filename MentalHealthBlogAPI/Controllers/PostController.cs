using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlogAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Post> GetAllPosts()
        {
            var posts = Data.GeneratePosts();
            return posts;
        }

        [HttpGet("{id}")]
        public Post GetById(int id)
        {
            var post = Data.GeneratePosts().FirstOrDefault(p => p.Id == id);
            return post != null ? post : new Post(string.Empty, "Post doens't exist", 0);
        }
               
    }
}
