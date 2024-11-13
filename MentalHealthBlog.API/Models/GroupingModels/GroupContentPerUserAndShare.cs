namespace MentalHealthBlog.API.Models.GroupingModels
{
    public class GroupContentPerUserAndShare
    {
        
        public int UserId { get; set; }
        public string ShareGuid { get; set; } = string.Empty;
        public int SharedWithId { get; set; }
        public GroupContentPerUserAndShare(){}
        public GroupContentPerUserAndShare(int userId, string shareGuid, int sharedWithId)
        {
            UserId = userId;
            ShareGuid = shareGuid;
            SharedWithId = sharedWithId;
        }
    }
}
