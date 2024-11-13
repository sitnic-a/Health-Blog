using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MentalExpertController : ControllerBase
    {
        private readonly IMentalExpertService _mentalExpertService;

        public MentalExpertController(IMentalExpertService mentalExpertService)
        {
            _mentalExpertService = mentalExpertService;
        }

        [HttpGet("shares-per-user")]
        public Task<List<SharesPerUserDto>> GetSharesPerUser()
        {
            return _mentalExpertService.GetSharesPerUser();
        }

    }
}
