namespace MentalHealthBlogAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public List<Post> Posts { get; set; }

        public User(string username, string passwordHash)
        {
            Username = username;
            PasswordHash = passwordHash;
            Posts = new List<Post>();
        }
    }
}
