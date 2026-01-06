namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class InviteDto
    {
        public int MentalHealthExpertId { get; set; }
        public string SendEmailTo { get; set; } = string.Empty;
    }
}
