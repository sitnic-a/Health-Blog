using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IStatisticsService
    {
        public Task<Response> PrepareForMontlyPieGraph(SearchPostDto query); 
    }
}
