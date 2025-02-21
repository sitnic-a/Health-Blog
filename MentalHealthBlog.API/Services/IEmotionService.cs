using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IEmotionService
    {
        public Task<Response> Get();
    }
}
