using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IExportService
    {
        Task<FileDto> ExportToPDF(List<PostDto> posts);
    }
}
