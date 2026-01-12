using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services.Therapy
{
    public interface ITherapyInviteService
    {
        Task<Response> CheckIfInformedAboutTherapyInvites(int regularUserId);
    }
}
