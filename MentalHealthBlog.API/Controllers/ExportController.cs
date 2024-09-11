using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExportController : ControllerBase
    {
        readonly IExportService _exportService;
        public ExportController(IExportService exportService)
        {
            _exportService = exportService;
        }

        [HttpPost]
        public void ExportToPDF(List<PostDto> posts)
        {
            _exportService.ExportToPDF();
        }
    }
}
