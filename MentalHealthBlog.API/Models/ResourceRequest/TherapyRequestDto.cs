namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class TherapyRequestDto
    {
        public int MentalHealthExpertId {  get; set; }
        public int MentalHealthExpertUserId { get; set; }
        public int RegularUserId { get; set; }
        public int? NewRequestStatus { get; set; }
        public bool? UserSendingRequest { get; set; }
        public bool? IsKeepingContent { get; set; }
    }
}
