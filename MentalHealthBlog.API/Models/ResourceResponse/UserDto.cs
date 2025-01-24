#pragma warning disable CS8618

namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class UserDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public List<Role> Roles { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public byte[]? PhotoAsFile { get; set; }
        public string? PhotoAsPath { get; set; } = string.Empty;

        public UserDto(){}
        public UserDto(string username, List<Role> roles, string phoneNumber, string organization, string? email = null, byte[]? photoAsFile=null, string?photoAsPath = null)
        {
            Username = username;
            Roles = roles;
            PhoneNumber = phoneNumber;
            Organization = organization;
            Email = email;
            PhotoAsFile = photoAsFile;
            PhotoAsPath = photoAsPath;
        }

        public UserDto(int id, string username)
        {
            Id=id;
            Username = username;
        }
    }
}
