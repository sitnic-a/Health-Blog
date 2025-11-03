namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SubscriptionTrialRequestDto
    {
        public int UserId { get; set; }
        public bool IsInTrialPeriod { get; set; }
        public bool IsMentalHealthExpert { get; set; }
    }
}
