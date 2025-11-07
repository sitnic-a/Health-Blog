namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class TrialPeriodDto
    {
        public int UserId { get; set; }
        public DateTime? ApprovedAt { get; set; } 
        public DateTime RegisteredAt { get; set; }
        public bool IsInTrialPeriod { get; set; }
        public DateTime TrialEndsAt { get; set; }
        public bool HavePaidForSubscription { get; set; }
        public bool IsInformedAboutSubscriptionExpiration { get; set; }
       
        public TrialPeriodDto(){}
        public TrialPeriodDto(int userId, DateTime registeredAt, bool isInTrialPeriod, DateTime trialEndsAt, bool havePaidForSubscription)
        {
            UserId = userId;
            RegisteredAt = registeredAt;
            IsInTrialPeriod = isInTrialPeriod;
            TrialEndsAt = trialEndsAt;
            HavePaidForSubscription = havePaidForSubscription;
        }


    }
}
