using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class ShareContentDto
    {
        public int PostId { get; set; }
        public int SharedWithId { get; set; }
        public DateTime? SharedAt { get; set; }

        public ShareContentDto(){}

        public ShareContentDto(int postId, int sharedWithId, DateTime? sharedAt)
        {
            PostId = postId;
            SharedWithId= sharedWithId;
            if (sharedAt.HasValue) SharedAt = sharedAt;
            else SharedAt = DateTime.Now;

        }
    }
}
