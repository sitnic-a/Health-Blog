using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface ITagService
    {
        Task<Response> GetTags();
    }
}
