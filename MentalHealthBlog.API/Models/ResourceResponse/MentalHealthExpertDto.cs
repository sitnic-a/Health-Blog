namespace MentalHealthBlog.API.Models.ResourceResponse
{
#pragma warning disable CS8618
    public class MentalHealthExpertDto
    {
        public MentalHealthExpertDto() { }

        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public byte[]? PhotoAsFile { get; set; }
        public string? PhotoAsPath { get; set; } = string.Empty;
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
        public string Username { get; set; }

    }
}
