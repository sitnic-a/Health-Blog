using System.Text.Json.Serialization;

namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class SignedUserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<Role> UserRoles { get; set; }
        public string JWToken { get; set; } = string.Empty;
        [JsonIgnore]
        public string RefreshToken { get; set; }

        public SignedUserDto(){}
        public SignedUserDto(int id, string username)
        {
            Id = id;
            Username = username;
        }
        public SignedUserDto(int id, string username, string jwtoken,string refreshToken, List<Role> roles)
        {
            Id = id;
            Username = username;
            JWToken = jwtoken;
            RefreshToken = refreshToken;
            UserRoles = roles;
        }
    }
}
