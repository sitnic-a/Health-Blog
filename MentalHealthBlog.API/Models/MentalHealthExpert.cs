using MentalHealthBlogAPI.Models;
#pragma warning disable CS8618

namespace MentalHealthBlog.API.Models
{
    public class MentalHealthExpert
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public byte[]? PhotoAsFile { get; set; }
        public string? PhotoAsPath { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public bool IsViewed { get; set; }

        public MentalHealthExpert(){}

        public MentalHealthExpert(string firstName, string lastName, string organization, string phoneNumber, string email, byte[]? photoAsFile = null, string? photoAsPath = null)
        {
            FirstName = firstName;
            LastName = lastName;
            Organization = organization;
            PhoneNumber = phoneNumber;
            Email = email;
            PhotoAsFile = photoAsFile;
            PhotoAsPath = photoAsPath;
        }
        public MentalHealthExpert(int userId, string firstName, string lastName, string organization, string phoneNumber, string email, byte[]? photoAsFile = null, string? photoAsPath = null)
        {
            UserId = userId;
            FirstName = firstName;
            LastName = lastName;
            Organization = organization;
            PhoneNumber = phoneNumber;
            Email = email;
            PhotoAsFile = photoAsFile;
            PhotoAsPath = photoAsPath;
        }


    }
}
