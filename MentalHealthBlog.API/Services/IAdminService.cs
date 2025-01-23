using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IAdminService
    {
        public Task<Response> Get(SearchUserDto? query = null);
        public Task<Response> GetNewRegisteredExperts(SearchExpertDto? query = null);
        public Task<Response> SetRegisteredExpertStatus(RegisterExpertPatchDto patchDto);
        public Task<Response> RemoveUserById(int id);
    }
}
