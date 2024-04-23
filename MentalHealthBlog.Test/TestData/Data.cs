using MentalHealthBlog.API.Models.ResourceRequest;

namespace MentalHealthBlog.Test.TestData
{
    public class Data
    {
        public static IEnumerable<object[]> ValidSearchPostDto =>
            new List<object[]>
            {
                new object[] {1},
            };
        public static IEnumerable<object[]> PostMethodsInvalidTestData =>
            new List<object[]>
            {
                new object[] { "", "Content_08", 2 },
                new object[] { "Title_08", "", 2 },
                new object[] { "Title_08", "", 0 },
                new object[] { "Title_08", "Content_08", 0 },
                new object[] { "", "", 0 },
                new object[] { "", "", 2 },
                new object[] { " ", " ", 2 },
                new object[] { " ", "Content_08", 2 },
                new object[] { "Title_08", " ", 2 },
                new object[] { " ", " ", 0 },
                new object[] { "Title_08", " ", 0 },
                new object[] { " ", "Content_08", 0 },
            };

        public static IEnumerable<object[]> PostMethodsValidTestData =>
            new List<object[]>
            {
                new object[] { "Title_08", "Content_08", 2 },
                new object[] { "Title_09", "Content_09", 2 },
            };

        public static IEnumerable<object[]> UpdateMethodInvalidFormRequest =>
            new List<object[]>
            {
                new object[]{1, "", "", 0},
                new object[]{1, "Title_01_Updated", "", 0},
                new object[]{1, "", "Content_01_Updated", 0},
                new object[]{1, "", "", 1},
                new object[]{1, "Title_01_Updated", "", 1},
                new object[]{1, "", "Content_01_Updated", 1},
                new object[]{1, " ", " ", 0},
                new object[]{1, "Title_01_Updated", " ", 0},
                new object[]{1, " ", "Content_01_Updated", 0},
                new object[]{1, " ", " ", 1},
                new object[]{1, "Title_01_Updated", " ", 1},
                new object[]{1, " ", "Content_01_Updated", 1},
            };

        public static IEnumerable<object[]> UpdateMethodInvalidPostId =>
            new List<object[]>
            {
                new object[]{0, "Title_01_Updated", "Content_01", 2},
                new object[]{-3, "Title_01_Updated", "Content_01", 2},
                new object[]{-100, "Title_01_Updated", "Content_01", 2},
                new object[]{100, "Title_01_Updated", "Content_01", 2}
            };

        public static IEnumerable<object[]> UpdateMethodsValidData =>
            new List<object[]>
            {
                new object[] {1, "Title_01_Updated", "Content_01_Updated",2},
                new object[] {1, "Title_01_Updated", "Content_01",2},
                new object[] {1, "Title_01", "Content_01_Updated",2},
            };


    }
}
