namespace MentalHealthBlog.API.Models
{
    public class AssignmentResponse
    {
        public int Id { get; set; }
        public int AssignmentId { get; set; }
        public Assignment Assignment { get; set; }
        public int ResponseById { get; set; }
        public string Content { get; set; } = string.Empty;
        
        [NpgsqlTypes.PgName("TIMESTAMP")]
        public DateTime WrittenAt { get; set; }

        public AssignmentResponse(){}
        public AssignmentResponse(int assignmentId, string content)
        {
            AssignmentId = assignmentId;
            Content = content;
        }
    }
}
