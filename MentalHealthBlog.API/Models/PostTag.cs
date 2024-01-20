using MentalHealthBlogAPI.Models;
using System.Text.Json.Serialization;

namespace MentalHealthBlog.API.Models
{
    public class PostTag
    {
        public int PostId { get; set; }
        public int TagId { get; set; }

        public PostTag(){}
        public PostTag(int postId, int tagId)
        {
            PostId = postId;
            TagId = tagId;
        }
    }
}
