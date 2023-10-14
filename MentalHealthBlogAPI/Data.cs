using MentalHealthBlogAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlogAPI
{
    public static class Data
    {
        public static IEnumerable<Post> GeneratePosts()
        {
            return new List<Post>
            {
                new Post(1,string.Empty, "24Kitchen is cool channel", 1),
                new Post(2, string.Empty, "Fight club is violent channel", 1),
                new Post(3,string.Empty, "I miss SK channel", 1),
                new Post(4,string.Empty, "Cooking is sometimes hard to advance", 1),
                new Post(5,string.Empty, "I bought an origami chips, I can't wait to taste it, yet", 1)
            };
        }
    }
}

