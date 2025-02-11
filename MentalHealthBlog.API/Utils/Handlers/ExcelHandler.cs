
using IronXL;
using MentalHealthBlog.API.Models;


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

            WorkBook workBook = WorkBook.Load(filePath);
            WorkSheet workSheet = workBook.WorkSheets[0];
            IronXL.Range range = workSheet;

            int numberOfRows = range.Rows.Length;
            int numberOfColumns = range.Columns.Length;
            const int __BOTTOM_LEVEL_EMOTION_COLUMN = 0;
            const int __TOP_LEVEL_EMOTION_COLUMN = 2;

            for (int i = 1; i <= numberOfRows; i++)
            {
                string bottomLevelEmotion = "";
                string topLevelEmotion = "";
                for (int j = 1; j <= numberOfColumns; j++)
                {
                    if (j == __BOTTOM_LEVEL_EMOTION_COLUMN)
                    {
                        if (!String.IsNullOrEmpty(range.Rows[i].Columns[j].ToString()))
                        {
                            bottomLevelEmotion = range.Rows[i].Columns[j].ToString();
                            continue;
                        }
                    }
                    else if (j == __TOP_LEVEL_EMOTION_COLUMN)
                    {
                        if (!String.IsNullOrEmpty(range.Rows[i].Columns[j].ToString()))
                        {
                            topLevelEmotion = range.Rows[i].Columns[j].ToString();
                        }
                    }

                    if (!String.IsNullOrEmpty(bottomLevelEmotion) && !String.IsNullOrEmpty(topLevelEmotion))
                    {
                        var emotion = String.Concat(bottomLevelEmotion, "(", topLevelEmotion, ")");
                        emotionFromFile.Add(new Emotion(emotionId, emotion));
                        ++emotionId;
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
