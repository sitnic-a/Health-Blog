using System.Text;

namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class FileDto
    {
        public byte[] Data { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string Pdf { get; set; }
        public int FileLength { get; set; }

        public FileDto(byte[] data, string filePath, string fileName, string document, int fileLenght)
        {
            Data = data;
            FilePath = filePath;
            FileName = fileName;
            Pdf = document;
            FileLength = fileLenght;
        }

        public FileDto() 
        {
            Data = Encoding.UTF8.GetBytes("0");
            FilePath = "";
            FileName = "";
            Pdf = "";
            FileLength= 0;
        }

        public string Base64(string path)
        {
            // Method to convert pdf to Base64
            byte[] bytes = File.ReadAllBytes(path);
            string file = Convert.ToBase64String(bytes);

            return file;
        }

    }
}
