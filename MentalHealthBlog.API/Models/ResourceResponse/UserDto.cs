#pragma warning disable CS8618

namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<Role> Roles { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;

        public UserDto(){}
        public UserDto(string username, List<Role> roles, string phoneNumber, string organization)
        {
            Username = username;
            Roles = roles;
            PhoneNumber = phoneNumber;
            Organization = organization;
        }

        public UserDto(int id, string username)
        {
            Id=id;
            Username = username;
        }
    }
}
