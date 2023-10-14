using System.Text.Json.Serialization;

namespace MentalHealthBlogAPI.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; } = new User(string.Empty,string.Empty);

        public Post(int id, string title, string content, int userId)
        {
            Id = id;
            Title = title;
            Content = content;
            UserId = userId;
        }
        public Post(string title, string content, int userId)
        {
            Title = title;
            Content = content;
            UserId = userId;
        }
    }
}
