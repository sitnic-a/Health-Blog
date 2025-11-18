namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SubscriptionStatusRequestDto
    {
        public int UserId { get; set; }
        public bool HavePaidForSubscription { get; set; }
    }
}
