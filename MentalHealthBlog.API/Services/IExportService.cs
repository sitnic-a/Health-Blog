using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Services
{
    public interface IExportService
    {
        Task<byte[]> ExportToPDF(List<PostDto> posts);
    }
}
