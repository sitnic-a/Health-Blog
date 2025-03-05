namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class LogoutDto
    {
        public int UserId { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
    }
}
