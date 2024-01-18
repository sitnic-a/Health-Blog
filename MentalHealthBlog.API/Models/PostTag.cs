using MentalHealthBlogAPI.Models;
using System.Text.Json.Serialization;

namespace MentalHealthBlog.API.Models
{
    public class PostTag
    {
        public int PostId { get; set; }
        [JsonIgnore]
        public Post? Post { get; set; } = new Post();
        public int TagId { get; set; }
        [JsonIgnore]
        public Tag? Tag { get; set; } = new Tag();
    }
}
