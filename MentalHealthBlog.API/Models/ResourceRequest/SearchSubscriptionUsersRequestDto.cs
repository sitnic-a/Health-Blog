namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SearchSubscriptionUsersRequestDto
    {
        public int SubscriptionYear { get; set; }
        public int SubscriptionMonth { get; set; }
        public int UserTypeId { get; set; }
        public string FirstNameLastNameUsername { get; set; } = string.Empty;   
    }
}
