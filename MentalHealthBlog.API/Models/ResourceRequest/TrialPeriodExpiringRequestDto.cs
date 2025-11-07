namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class TrialPeriodExpiringRequestDto
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public List<Role>? UserRoles { get; set; }

    }
}
