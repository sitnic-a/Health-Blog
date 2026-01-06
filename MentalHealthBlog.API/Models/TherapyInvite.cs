namespace MentalHealthBlog.API.Models
{
    public class TherapyInvite
    {
        public string Id { get; set; }
        public int MentalHealthExpertId { get; set; }
        public int? RegularUserId { get; set; }
        public bool IsRegularUserAlreadyUsingApplication { get; set; }
        public DateTime InvitedAt { get; set; }
        public bool IsUsed { get; set; }

        public TherapyInvite(){}
        public TherapyInvite(string id, int mentalHealthExpertId, bool isRegularUserAlreadyUsingApplication, int? regularUserId = null)
        {
            Id = id;
            MentalHealthExpertId = mentalHealthExpertId;
            IsRegularUserAlreadyUsingApplication = isRegularUserAlreadyUsingApplication;
            RegularUserId = regularUserId;
            InvitedAt = DateTime.UtcNow;
            IsUsed = false;
        }
    }
}
