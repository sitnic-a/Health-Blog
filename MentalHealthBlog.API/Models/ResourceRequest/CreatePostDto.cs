using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Models.ResourceRequest
{
    //Class made of form fields
    public class CreatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public List<int> Emotions { get; set; }

        public CreatePostDto(){}

    }
}
