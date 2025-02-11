using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using MentalHealthBlog.API.Utils.Handlers;
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
       public async Task<FileDto> ExportToPDF([FromBody] List<PostDto> posts)
        {
            FileDto file = await _exportService.ExportToPDF(posts);

            string pdf = file.Base64(file.FilePath);
            FileDto exportedFile = new FileDto(file.Data, file.FilePath,file.FileName, pdf,file.FileLength);

            return exportedFile != null ? exportedFile : new FileDto();
        }

        [HttpGet]
        public List<Emotion> GetEmotions()
        {
            ExcelHandler excelHandler = new ExcelHandler();
            List<Emotion> emotions = excelHandler.CallGetAllEmotionsFromEmotionWheelFile();
            return emotions;
        }
    }
}
