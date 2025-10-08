namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateAssignmentResponseDto
    {
        public int AssignmentId { get; set; }
        public int ResponseById { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime? RespondedAt { get; set; } = DateTime.UtcNow;
    }
}
