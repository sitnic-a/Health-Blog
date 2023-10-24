using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlogAPI
{
    public static class DataGenerator
    {
        public static IEnumerable<Post> GeneratePosts()
        {
            return new List<Post>
            {
                new Post(string.Empty, "24Kitchen is cool channel", 1),
                new Post(string.Empty, "Fight club is violent channel", 1),
                new Post(string.Empty, "I miss SK channel", 1),
                new Post(string.Empty, "Cooking is sometimes hard to advance", 1),
                new Post(string.Empty, "I bought an origami chips, I can't wait to taste it, yet", 1)
            };
        }
    }
}

