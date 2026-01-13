namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class TherapyInviteDto
    {
        public string Id { get; set; } = string.Empty;
        public int MentalHealthExpertId { get; set; }
        public string MentalHealthExpertFirstName { get; set; } = string.Empty;
        public string MentalHealthExpertLastName { get; set; } = string.Empty;
        public bool IsRegularUserNotifiedAboutAutomaticConnection { get; set; }
    }
}
