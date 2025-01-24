namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SearchUserDto
    {
        public int Role { get; set; }
        public string SearchCondition { get; set; } = string.Empty;

        public SearchUserDto(){}
    }
}
