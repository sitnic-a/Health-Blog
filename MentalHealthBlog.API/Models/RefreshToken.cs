using MentalHealthBlogAPI.Models;
using System.Text.Json.Serialization;

namespace MentalHealthBlog.API.Models
{
    public class RefreshToken
    {
        [JsonIgnore]
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public bool IsExpired => DateTime.UtcNow.AddHours(1) >= ExpiresAt;
        public bool IsActive => !IsExpired && !IsRevoked;
        public bool IsRevoked => RevokedAt != null;
        public string ReplacedByToken { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
