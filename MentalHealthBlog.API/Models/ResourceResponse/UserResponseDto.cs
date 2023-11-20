namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string JWToken { get; set; } = string.Empty;

        public UserResponseDto(){}

        public UserResponseDto(int id, string username, string jwtoken)
        {
            Id = id;
            Username = username;
            JWToken = jwtoken;
        }
    }
}
