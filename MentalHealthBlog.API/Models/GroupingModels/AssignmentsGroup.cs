namespace MentalHealthBlog.API.Models.GroupingModels
{
    public class AssignmentsGroup
    {
        public int Key { get; set; }
        public List<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
