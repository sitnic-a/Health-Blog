namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SearchAssignmentDto
    {
        public int GivenById { get; set; }
        public int GivenToId { get; set; }
        public bool IsMentalHealthExpert { get; set; }
    }
}
