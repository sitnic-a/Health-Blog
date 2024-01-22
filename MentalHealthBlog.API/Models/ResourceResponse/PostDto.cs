namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public List<string> Tags { get; set; }

        public PostDto() { }
    }
}
