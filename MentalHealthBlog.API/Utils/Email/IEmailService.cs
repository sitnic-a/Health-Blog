using MentalHealthBlog.API.Models.ResourceResponse;

namespace MentalHealthBlog.API.Utils.Email
{
    public interface IEmailService
    {
        public Task<Response> SendEmail(string email);
    }
}
