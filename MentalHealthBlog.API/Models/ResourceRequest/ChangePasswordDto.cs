namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class ChangePasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmationPassword { get; set; } = string.Empty;
        public string Blueprint { get; set; } = string.Empty;
        public ChangePasswordDto(){}
        
        public ChangePasswordDto(string email, string password, string confirmationPassword, string blueprint)
        {
            Email = email;
            Password = password;
            ConfirmationPassword = confirmationPassword;
            Blueprint = blueprint;
        }
    }
}
