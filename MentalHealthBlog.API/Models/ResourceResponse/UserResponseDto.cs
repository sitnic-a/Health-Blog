namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<Role> UserRoles { get; set; }
        public string JWToken { get; set; } = string.Empty;

        public UserResponseDto(){}
        public UserResponseDto(int id, string username)
        {
            Id = id;
            Username = username;
        }
        public UserResponseDto(int id, string username, string jwtoken, List<Role> roles)
        {
            Id = id;
            Username = username;
            JWToken = jwtoken;
            UserRoles = roles;
        }
    }
}
