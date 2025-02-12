using MentalHealthBlog.API.Models;
using OfficeOpenXml;

#pragma warning disable CS8600

namespace MentalHealthBlog.API.Utils.Handlers
{
    public class ExcelHandler
    {
        public ExcelHandler() { }

        private List<Emotion> GetAllEmotionsFromEmotionWheelFile()
        {
            List<Emotion> emotionFromFile = new List<Emotion>();
            int emotionId = 1;

            string currentDir = Environment.CurrentDirectory;
            string fileDirectory = System.IO.Directory.GetCurrentDirectory();
            DirectoryInfo directory = new DirectoryInfo(
                System.IO.Path.GetFullPath(System.IO.Path.Combine(currentDir, "Data\\" + $"Emotion Wheel.xlsx")));

            string filePath = directory.FullName;

            FileInfo existingFile = new FileInfo(filePath);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            
            using (ExcelPackage package = new ExcelPackage(existingFile))
            {
                //Get the first worksheet in the workbook
                ExcelWorksheet worksheet = package.Workbook.Worksheets[0];
                int numberOfRows = worksheet.Dimension.End.Row;
                int numberOfColumns = worksheet.Dimension.End.Column;
                
                const int __FIRST_ROW_WITH_VALUE = 2;
                const int __FIRST_COLUMN = 1;

                //Column names
                const int __BOTTOM_LEVEL_EMOTION_COLUMN = 1;
                const int __TOP_LEVEL_EMOTION_COLUMN = 3;
                
                string bottomLevelEmotion = "";
                string topLevelEmotion = "";

                for (int i = __FIRST_ROW_WITH_VALUE; i <= numberOfRows; i++)
                {
                    
                    for (int j = __FIRST_COLUMN; j <= numberOfColumns; j++)
                    {
                        if (j == __BOTTOM_LEVEL_EMOTION_COLUMN)
                        {
                            if (!string.IsNullOrEmpty(worksheet.Cells[i, j].Value.ToString()))
                            {
                                bottomLevelEmotion = worksheet.Cells[i, j].Value.ToString();
                                continue;
                            }
                        }
                        else if (j == __TOP_LEVEL_EMOTION_COLUMN)
                        {
                            if (!string.IsNullOrEmpty(worksheet.Cells[i, j].Value.ToString()))
                            {
                                topLevelEmotion = worksheet.Cells[i, j].Value.ToString();
                            }
                        }

                        if (!string.IsNullOrEmpty(bottomLevelEmotion) && !string.IsNullOrEmpty(topLevelEmotion))
                        {
                            var emotion = string.Concat(bottomLevelEmotion, "(", topLevelEmotion, ")");
                            emotionFromFile.Add(new Emotion(emotionId, emotion));
                            ++emotionId;
                            bottomLevelEmotion = "";
                            topLevelEmotion = "";
                        }
                    }
                }
            }
            return emotionFromFile.Any() ? emotionFromFile : new List<Emotion>();
        }

        public List<Emotion> CallGetAllEmotionsFromEmotionWheelFile()
        {
            return GetAllEmotionsFromEmotionWheelFile();
        }
    }
}
