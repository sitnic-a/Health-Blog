using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IMentalExpertService
    {
        public Task<Response> GetMentalHealthExperts(SearchExpertDto? request);
        public Task<Response> GetSharesPerUser(ExpertSearchContentDto query);
        public Task<Response> GetUsersWithSetAssignments(ExpertSearchContentDto query);
        public Task<Response> CreateAssignment(CreateAssignmentDto request);
        public Task<Response> GetInvitationById(Guid id);
        public Task<Response> CreateInvite(InviteDto request);
        public Task<Response> SendInviteToUser(InviteDto request);
    }
}
