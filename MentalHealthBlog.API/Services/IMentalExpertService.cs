using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IMentalExpertService
    {
        public Task<Response> GetSharesPerUser(ExpertSearchContentDto query);
    }
}
