using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IAdminService
    {
        public Task<Response> GetNewRegisteredExperts();
    }
}
