using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IShareService
    {
        public Task<List<PostDto>> ShareByLink(string shareId); 
        public Task<List<UserDto>> GetExpertsAndRelatives();
        public Task<List<Share>> ShareContent(ShareContentDto contentToBeShared);
        
    }
}
