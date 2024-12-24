namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreateUserDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public List<int> Roles { get; set; }
        public bool?IsMentalHealthExpert { get; set; }
        public CreateMentalHealthExpertDto? MentalHealthExpert { get; set; }

        public CreateUserDto()
        {
            Roles = new List<int>();
        }

        public CreateUserDto(string username, string password, List<int> roles,bool?isMentalHealthExpert=null, CreateMentalHealthExpertDto? mentalHealthExpertDto=null)
        {
            Username = username;
            Password = password;
            Roles = roles;
            IsMentalHealthExpert = isMentalHealthExpert;

            if (mentalHealthExpertDto is not null)
            {
                MentalHealthExpert = new CreateMentalHealthExpertDto(
                    mentalHealthExpertDto.FirstName,
                    mentalHealthExpertDto.LastName,
                    mentalHealthExpertDto.Organization,
                    mentalHealthExpertDto.PhoneNumber,
                    mentalHealthExpertDto?.Email,
                    mentalHealthExpertDto?.PhotoAsFile,
                    mentalHealthExpertDto?.PhotoAsPath);
            }
        }
    }
}
