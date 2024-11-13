using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IMentalExpertService
    {
        public Task<List<SharesPerUserDto>> GetSharesPerUser(); 
    }
}
