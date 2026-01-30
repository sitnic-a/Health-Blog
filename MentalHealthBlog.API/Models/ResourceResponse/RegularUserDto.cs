namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class RegularUserDto
    {
        public int RegularUserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email{ get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;

        public RegularUserDto(int regularUserId, string firstName, string lastName, string email, string username)
        {
            RegularUserId = regularUserId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Username = username;
        }
    }
}
