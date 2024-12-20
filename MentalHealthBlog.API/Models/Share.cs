using System;
using System.ComponentModel.DataAnnotations.Schema;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Models
{
    public class Share
    {
        public int Id { get; set; }
        public string ShareGuid { get; set; } = string.Empty;
        public User? SharedWith { get; set; }
        public int? SharedWithId { get; set; }
        public Post SharedPost { get; set; }
        public int SharedPostId { get; set; }
        public DateTime SharedAt { get; set; }

        public Share(){}

        public Share(string shareGuid, int sharedWithId, int sharedPostId)
        {
            ShareGuid = shareGuid; 
            SharedWithId = sharedWithId;
            SharedPostId = sharedPostId;
        }
    }
}
