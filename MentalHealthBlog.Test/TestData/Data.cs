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
    }
}
