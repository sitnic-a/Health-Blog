namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class TrialPeriodExpiringRequestDto
    {
        public int UserId { get; set; }
        public bool IsMentalHealthExpert { get; set; }
        public List<Role>? UserRoles { get; set; }

    }
}
