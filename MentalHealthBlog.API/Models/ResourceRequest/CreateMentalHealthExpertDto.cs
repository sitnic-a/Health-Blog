namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateMentalHealthExpertDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public IFormFile? Photo { get; set; }

        public CreateMentalHealthExpertDto(){}

        public CreateMentalHealthExpertDto(string firstName, string lastName, string organization, string phoneNumber, string? email= null, IFormFile? photo=null)
        {
            FirstName = firstName;
            LastName = lastName;
            Organization = organization;
            PhoneNumber = phoneNumber;
            Email = email;
            Photo = photo;
        }
    }
}
