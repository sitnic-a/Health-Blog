using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegularUserController : ControllerBase
    {
        private readonly IRegularUserService _regularUserService;
        public RegularUserController(IRegularUserService regularUserService)
        {
            _regularUserService = regularUserService;
        }
        [HttpGet("shares-per-mental-health-expert")]
        public async Task<Response> GetSharesPerMentalHealthExpert()
        {
            return await _regularUserService.GetSharesPerMentalHealthExpert();
        }
    }
}
