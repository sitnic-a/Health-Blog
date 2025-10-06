using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IAssignmentService
    {
        public Task<Response> GetUsersAssignments(SearchAssignmentDto request);
    }
}
