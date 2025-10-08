using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IAssignmentService
    {
        public Task<Response> GetUsersAssignments(SearchAssignmentDto request);
        public Task<Response> GetAssignmentResponses(int assignmentId);
        public Task<Response> RespondToAssignment(CreateAssignmentResponseDto request);
    }
}
