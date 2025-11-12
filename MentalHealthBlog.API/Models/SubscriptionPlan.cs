namespace MentalHealthBlog.API.Models
{
    public class SubscriptionPlan
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public float? Price { get; set; }

        public SubscriptionPlan(){}
        public SubscriptionPlan(int id, string name, string description, float? price = null)
        {
            Id = id;
            Name = name;
            Description = description;
            Price = price;
        }
    }
}
