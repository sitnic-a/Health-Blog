namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class StatisticsPostTagDto
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = string.Empty;
        public Tag? Tag { get; set; }
        public int NumberOfTags { get; set; }

        public StatisticsPostTagDto() { }
        public StatisticsPostTagDto(string tagName, int numberOfTags)
        {
            TagName = tagName;
            NumberOfTags = numberOfTags;
        }
    }
}
