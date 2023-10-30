namespace MentalHealthBlog.Test.TestData
{
    public class Data
    {
        public static IEnumerable<object[]> PostMethodsInvalidTestData =>
        new List<object[]>
        {
            new object[] { "", "Content_08", 2 },
            new object[] { "Title_08", "", 2 },
            new object[] { "Title_08", "", 0 },
            new object[] { "Title_08", "Content_08", 0 },
            new object[] { "", "", 0 },
            new object[] { "", "", 2 },
        };

        public static IEnumerable<object[]> PostMethodsValidTestData =>
        new List<object[]>
        {
            new object[] { "Title_08", "Content_08", 2 },
            new object[] { "Title_09", "Content_09", 2 },
        };

        public static IEnumerable<object[]> UpdateMethodsInvalidData =>
            new List<object[]>
        {
                new object[]{0, "Title_01_Updated", "Content_01", 2},
                new object[]{1, "", "Content_01", 2},
                new object[]{1, "Title_01", "", 2},
                new object[]{1, "Title_01", "Content_01", 0},
                new object[]{-1, "Title_01", "Content_01", 2},
                new object[]{-1, "", "", 0},
                new object[]{-1, "", "", -1},
                new object[]{10, "Title_10", "Content_10", 1}
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
