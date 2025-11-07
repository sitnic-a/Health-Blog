namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class UserTrialSubscriptionDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovedAt { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
        public bool IsInTrialPeriod { get; set; } = true;
        public DateTime TrialEndsAt { get; set; }
        public bool HavePaidForSubscription { get; set; } = false;
        public bool IsInformedAboutSubscriptionExpiration { get; set; }

    }
}
