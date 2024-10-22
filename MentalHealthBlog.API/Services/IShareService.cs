using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IShareService
    {
        public Task<List<UserDto>> GetExpertsAndRelatives();
        
    }
}
