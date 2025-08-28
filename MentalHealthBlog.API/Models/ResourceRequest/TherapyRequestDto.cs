namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class TherapyRequestDto
    {
        // Prepraviti i staviti MentalHealthExpertId da bude pravi Id, a MentalHealthExpertUserId da bude UserId koji ima MHE
        public int _MentalHealthExpertId {  get; set; }
        public int MentalHealthExpertId { get; set; }
        public int RegularUserId { get; set; }
        public int? NewRequestStatus { get; set; }
        public bool? UserSendingRequest { get; set; }
        public bool? IsKeepingContent { get; set; }
    }
}
