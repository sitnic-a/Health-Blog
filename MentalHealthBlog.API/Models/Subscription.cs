using MentalHealthBlogAPI.Models;

#pragma warning disable CS8618

namespace MentalHealthBlog.API.Models
{
    public class Subscription
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public float PaidAmount { get; set; }
        public bool IsRenewingSubscription { get; set; }
        public int? SubscriptionPlanId { get; set; }
        public SubscriptionPlan SubscriptionPlan { get; set; }
    }
}
