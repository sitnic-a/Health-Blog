using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagController(ITagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        public async Task<Response> GetAllTags()
        {
            return await _tagService.GetTags();
        }
    }
}
