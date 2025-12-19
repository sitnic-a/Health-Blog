using System.ComponentModel;

namespace MentalHealthBlog.API.Models
{
    public class Base
    {
        private const int __TRIAL_PERIOD__ = 7;

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
        public DateTime? FirstLoggedAt { get; set; }
        public DateTime? LastLoggedAt { get; set; }

        public bool IsInTrialPeriod { get; set; } = true;

        public DateTime? TrialEndsAt { get; set; }
        public bool HavePaidForSubscription { get; set; } = false;
        public bool IsInformedAboutSubscriptionExpiration { get; set; } = false;
        public bool IsSuspended { get; set; }
        public Base()
        {
            RegisteredAt = DateTime.UtcNow;
            TrialEndsAt = null;
        }

    }
}
