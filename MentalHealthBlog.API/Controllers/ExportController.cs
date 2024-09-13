using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Crypto.Tls;
using System;
using System.IO;
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
       public async Task<IActionResult> ExportToPDF(List<PostDto> posts)
        {
            FileDto file = await _exportService.ExportToPDF(posts);
            return File(file.Data, "application/octet-stream", file.FileName);
        }
    }
}
