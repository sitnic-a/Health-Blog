namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateSubscriptionDto
    {
        public int UserId { get; set; }
        public int? SubscriptionPlanId { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public float? PaidAmount { get; set; }
        public bool? IsRenewingSubscription { get; set; }
        public bool IsCreatingAnAccount { get; set; }

    }
}
