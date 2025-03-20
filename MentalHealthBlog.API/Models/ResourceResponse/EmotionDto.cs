namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class EmotionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public EmotionDto(){}
        public EmotionDto(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
