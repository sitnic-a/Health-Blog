namespace MentalHealthBlog.API.Models
{
    public class Emotion
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public Emotion(){}

        public Emotion(int id, string name, string? color=null)
        {
            Id = id;
            Name = name;
        }
    }
}
