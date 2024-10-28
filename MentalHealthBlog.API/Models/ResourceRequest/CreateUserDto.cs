namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public List<int> Roles { get; set; }

        public CreateUserDto()
        {
            Roles = new List<int>();
        }

        public CreateUserDto(string username, string password, List<int> roles)
        {
            Username = username;
            Password = password;
            Roles = roles;
        }
    }
}
