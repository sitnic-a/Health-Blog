namespace MentalHealthBlogAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public byte[] PasswordSalt { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public List<Post> Posts { get; set; }

        public User()
        {
            PasswordSalt = new byte[128];
            Posts = new List<Post>();
        }

        public User(string username, string passwordHash)
        {
            Username = username;
            PasswordSalt = new byte[128];
            PasswordHash = passwordHash;
            Posts = new List<Post>();
        }
    }
}
