namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class SubscriptionUsersDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public List<Role> Roles { get; set; } = new List<Role>();
        public DateTime? PaidAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool ExpiringSoon { get; set; }
        public float? PaidAmount { get; set; }
        public int SubscriptionPlanId { get; set; }
        public bool HavePaidForSubscription { get; set; }
        public bool IsInTrialPeriod { get; set; }
        public DateTime TrialEndsAt { get; set; }
    }
}
