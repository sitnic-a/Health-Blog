using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IMentalExpertService
    {
        public Task<Response> GetRegularUsersByTherapyStatus(Models.ResourceRequest.TherapyRequestDto request);
        public Task<Response> GetMentalHealthExperts(SearchExpertDto? request);
        public Task<Response> GetSharesPerUser(ExpertSearchContentDto query);
        public Task<Response> GetUsersWithSetAssignments(ExpertSearchContentDto query);
        public Task<Response> CreateAssignment(CreateAssignmentDto request);
        public Task<Response> GetInvitationById(string id);
        public Task<Response> CreateInvite(InviteDto request);
        public Task<Response> SendInviteToUser(InviteDto request);
    }
}
