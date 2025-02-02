using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IRegularUserService
    {
        public Task<Response> GetSharesPerMentalHealthExpert();
        public Task<Response> RevokeContentPermission(RegularUserPermissionDto request);

    }
}
