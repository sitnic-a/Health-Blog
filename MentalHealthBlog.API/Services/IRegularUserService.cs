using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IRegularUserService
    {
        public Task<Response> GetSharesPerMentalHealthExpert();

    }
}
