namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SearchExpertDto
    {
        public int LoggedUserId { get; set; }
        public bool? IsFiltering { get; set; }
        public bool? Status { get; set; }
        public string? Name { get; set; }
    }
}
