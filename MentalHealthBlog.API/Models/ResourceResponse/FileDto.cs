namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class FileDto
    {
        public byte[] Data { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }

        public FileDto(byte[] data, string filePath, string fileName)
        {
            Data = data;
            FilePath = filePath;
            FileName = fileName;
        }

    }
}
