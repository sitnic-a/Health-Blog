namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateAssignmentDto
    {
        public int AssignmentGivenToId { get; set; }
        public int AssignmentGivenById { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public CreateAssignmentDto(){}
        public CreateAssignmentDto(int assignmentGivenToId, int assignmentGivenById, string content, DateTime createdAt)
        {
            AssignmentGivenToId = assignmentGivenToId;
            AssignmentGivenById = assignmentGivenById;
            Content = content;
            CreatedAt = createdAt;
        }
    }
}
