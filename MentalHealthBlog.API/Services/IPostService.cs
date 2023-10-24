using MentalHealthBlogAPI.Models;

namespace MentalHealthBlogAPI.Services
{
    public interface IPostService
    {
        public Task<IEnumerable<Post>> GetPosts();
        public Task<Post> GetById(int id);
        public Task<Post> Add(Post post);
        public Task<Post> Update(int id, Post post);
        public Task<Post> Delete(int id);
    }
}
