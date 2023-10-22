using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Mvc;
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
            return searched != null ? searched : new Post();
        }

        public async Task<Post> Add([FromBody] Post post)
        {
            await _context.AddAsync(post);
            await _context.SaveChangesAsync();
            return post;
        }
        public async Task<Post> Update(int id, [FromBody] Post post)
        {
            var searched = await _context.Posts.FindAsync(id);
            if (searched != null)
            {
                searched.Id = id;
                searched.Title = post.Title;
                searched.Content = post.Content;
                searched.UserId = post.UserId;
                await _context.SaveChangesAsync();
                return searched;
            }
            return new Post("","",0);
        }
    }
}
