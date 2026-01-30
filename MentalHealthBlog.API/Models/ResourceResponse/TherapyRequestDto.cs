namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class TherapyRequestDto
    {
        public int RegularUserId { get; set; }
        public string RegularUserFirstName { get; set; } = string.Empty;
        public string RegularUserLastName { get; set; } = string.Empty;
        public int MentalHealthExpertUserId { get; set; }
        public DateTime SentAt { get; set; }
        public RequestStatusEnum RequestStatus { get; set; }
        public bool IsMentalHealthExpertInviting { get; set; }

        public TherapyRequestDto(){}
        public TherapyRequestDto(int regularUserId, string regularUserFirstName, string regularUserLastName, int mentalHealthExpertUserId, DateTime sentAt, RequestStatusEnum requestStatus)
        {
            RegularUserId = regularUserId;
            RegularUserFirstName = regularUserFirstName;
            RegularUserLastName = regularUserLastName;
            MentalHealthExpertUserId = mentalHealthExpertUserId;
            SentAt = sentAt;
            RequestStatus = requestStatus;
        }
        
    }
}
