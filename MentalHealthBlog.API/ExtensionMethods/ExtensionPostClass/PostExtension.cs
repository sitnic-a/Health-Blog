using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.ExtensionMethods.ExtensionPostClass
{
    public static class PostExtension
    {
        public static bool IsNullOrEmpthy(this Post post)
        {
            return String.IsNullOrEmpty(post.Title) || String.IsNullOrEmpty(post.Content) || post.UserId <= 0;
        }
    }
}
