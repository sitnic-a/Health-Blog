using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Models
{
    public class Assignment
    {
        public int Id { get; set; }
        public User AssignmentGivenTo { get; set; }
        public int AssignmentGivenToId { get; set; }
        public MentalHealthExpert AssignmentGivenBy { get; set; }
        public int AssignmentGivenById { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        public Assignment(int assignmentGivenToId, int assignmentGivenById, string content, DateTime createdAt)
        {
            AssignmentGivenToId = assignmentGivenToId;
            AssignmentGivenById = assignmentGivenById;
            Content = content;
            CreatedAt = createdAt;
        }
    }
}
