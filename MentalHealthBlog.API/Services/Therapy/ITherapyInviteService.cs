using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services.Therapy
{
    public interface ITherapyInviteService
    {
        public Task<Response> GetRegularUserUnnotifiedAutomaticConnectionTherapyInvites(int regularUserId);
        public Task<Response> MarkRegularUserAutomaticConnectionAsNotified(int regularUserId);
    }
}
