using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IAdminService
    {
        public Task<Response> GetNewRegisteredExperts();
        public Task<Response> SetRegisteredExpertStatus(RegisterExpertPatchDto patchDto);
    }
}
