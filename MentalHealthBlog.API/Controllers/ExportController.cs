using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;

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
        public async Task<byte[]> ExportToPDF([FromBody] List<PostDto> postsToExport)
        {
            if (postsToExport == null || postsToExport.Count == 0)
            {
                var bytes = Encoding.UTF8.GetBytes("");
                return bytes;
            }
                
           return await _exportService.ExportToPDF(postsToExport);
        }
    }
}
