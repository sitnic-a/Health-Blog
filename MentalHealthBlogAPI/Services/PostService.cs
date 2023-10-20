using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlogAPI.Services
{
    public class PostService : IPostService
    {
        private readonly DataContext _context;

        public PostService(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Post>> GetPosts()
        {
            return await _context.Posts.ToListAsync();
        }
        public async Task<Post> GetById(int id)
        {
            var searched = await _context.Posts.FindAsync(id);
            return searched != null ? searched : new Post(string.Empty,string.Empty,-1);
        }

        public Task<Post> Add(Post post)
        {
            throw new NotImplementedException();
        }
        public Task<Post> Update(int id, Post post)
        {
            throw new NotImplementedException();
        }
    }
}
