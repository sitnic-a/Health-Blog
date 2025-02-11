using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IShareService
    {
        public Task<Response> ShareByLink(string shareId); 
        public Task<Response> ShareContent(ShareContentDto contentToBeShared);
        public Task<Response> GetExpertsAndRelatives();
        
    }
}
