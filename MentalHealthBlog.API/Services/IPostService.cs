using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlogAPI.Services
{
    public interface IPostService
    {
        public Task<Response> GetPosts();
        public Task<Response> GetById(int id);
        public Task<Response> Add(CreatePostDto post);
        public Task<Response> Update(int id, Post post);
        public Task<Response> Delete(int id);
    }
}
