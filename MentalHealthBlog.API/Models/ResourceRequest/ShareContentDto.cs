using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class ShareContentDto
    {
        public List<int> PostIds { get; set; }
        public List<int> SharedWithIds { get; set; }
        public DateTime? SharedAt { get; set; }
        public bool ShareLink { get; set; }=false;

        public ShareContentDto(){}

        public ShareContentDto(List<int> postIds, List<int> sharedWithIds, DateTime? sharedAt, bool shareLink)
        {
            PostIds = postIds;
            SharedWithIds= sharedWithIds;
            if (sharedAt.HasValue) SharedAt = sharedAt;
            else SharedAt = DateTime.Now;
            ShareLink = shareLink;
        }
    }
}
