using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IStatisticsService
    {
        public Task<Response> PrepareForMontlyPieGraph(); 
    }
}
