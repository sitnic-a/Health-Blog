#pragma warning disable CS8618

namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class PostDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Tags { get; set; }

        public PostDto() { }

        public PostDto(int id, string title, string content, int userId, DateTime createdAt, List<string> tags)
        {
            Id = id;
            Title = title;
            Content = content;
            UserId = userId;
            CreatedAt = createdAt;
            Tags = new List<string>(tags);
        }
    }
}
