using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services.Therapy
{
    public interface ITherapyRequestService
    {
        public Task<Response> GetRequestsForMentalHealthExpert(SearchTherapyRequestDto? query=null);
    }
}
