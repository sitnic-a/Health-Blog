namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class CurrentSubscriptionDto
    {
        public int UserId { get; set; }
        public DateTime? PaidAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; } = DateTime.UtcNow;
        public bool IsInTrialPeriod { get; set; }
        public bool HavePaidForSubscription { get; set; }
    }
}
