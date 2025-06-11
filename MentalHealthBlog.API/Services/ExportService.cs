using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils;

namespace MentalHealthBlog.API.Services
{
    enum ExportServiceLogTypes
    {
        EXPORTED_TO_PDF,
        FAILED
    }
    public class ExportService : IExportService
    {
        private readonly ILogger<IExportService> _exportLoggerService;
        public ExportService(ILogger<IExportService> exportLoggerService)
        {
            _exportLoggerService = exportLoggerService;
        }
        public async Task<FileDto> ExportToPDF(List<PostDto> posts)
        {
            try
            {
                PDFGenerators generator = new PDFGenerators();
                FileDto file = await generator.CreatePdfFile(posts);

                if (file != null)
                {
                    _exportLoggerService.LogInformation($"EXPORT-PDF: {ExportServiceLogTypes.EXPORTED_TO_PDF.ToString()}");
                    return file;
                }
                _exportLoggerService.LogInformation($"EXPORT-PDF: {ExportServiceLogTypes.FAILED.ToString()}");
                throw new IOException("PDF File is not created!");
            }
            catch (Exception e)
            {
                _exportLoggerService.LogError($"EXPORT-PDF: {e.Message}");
                throw;
            }
            
        }
    }
}
