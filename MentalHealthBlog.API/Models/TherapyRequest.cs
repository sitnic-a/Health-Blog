namespace MentalHealthBlog.API.Models
{
    public class TherapyRequest
    {
        public int RegularUserId { get; set; }
        public RegularUser? RegularUser { get; set; }
        public int MentalHealthExpertId { get; set; }

        public RequestStatusEnum RequestStatus { get; set; } = RequestStatusEnum.Pending;
        
        [NpgsqlTypes.PgName("TIMESTAMP")]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public bool? IsMentalHealthExpertInviting { get;set; }

        public TherapyRequest() { }
        public TherapyRequest(int regularUserId, int mentalHealthExpertId, string? therapyInvitationId = null, bool? isMentalHealthExpertInviting = null)
        {
            RegularUserId = regularUserId;
            MentalHealthExpertId = mentalHealthExpertId;
            if (!string.IsNullOrEmpty(therapyInvitationId))
            {
                RequestStatus = RequestStatusEnum.Approved;
            }
            IsMentalHealthExpertInviting = isMentalHealthExpertInviting;
        }
    }
}
