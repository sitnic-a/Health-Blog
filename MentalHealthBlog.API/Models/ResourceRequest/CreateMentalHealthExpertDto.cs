namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateMentalHealthExpertDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public byte[]? PhotoAsFile { get; set; }
        public string? PhotoAsPath { get; set; } = string.Empty;

        public CreateMentalHealthExpertDto(){}

        public CreateMentalHealthExpertDto(string firstName, string lastName, string organization, string phoneNumber, string? email= null, byte[]?photoAsFile=null, string?photoAsPath=null)
        {
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
