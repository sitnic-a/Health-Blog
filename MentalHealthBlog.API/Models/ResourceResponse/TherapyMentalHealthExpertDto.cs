namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class TherapyMentalHealthExpertDto
    {
        public int MentalHealthExpertId { get; set; }
        public int RegularUserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public byte[]? PhotoAsFile { get; set; }
        public string? PhotoAsPath { get; set; } = string.Empty;
        public string Username { get; set; }
        public RequestStatusEnum RequestStatus { get; set; }
    }
}
