namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateRegularUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsInTherapy { get; set; }
        public List<string> MentalHealthExpertsToConnectWithIds { get; set; } = new List<string>();

        public CreateRegularUserDto(){}
        public CreateRegularUserDto(string firstName, string lastName, string email, bool isInTherapy, List<string> mentalHealthExpertsToConnectWithIds)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            IsInTherapy = isInTherapy;
            MentalHealthExpertsToConnectWithIds = mentalHealthExpertsToConnectWithIds;
        }
    }
}
