using MailKit.Net.Smtp;
using MailKit.Security;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace MentalHealthBlog.API.Utils.Email
{

    enum EmailLogTypes
    {
        SUCCESS,
        ERROR
    }

    public class EmailService : IEmailService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private Guid _safetyChangeMeasure; 
        public EmailService(DataContext context,IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<Response> SendEmail(string email)
        {
            try
            {
                _safetyChangeMeasure = Guid.NewGuid();
                var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
                var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
                var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
                var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");

                var allRegularUserEmails = await _context.MentalHealthExperts
                    .Where(mhe => !string.IsNullOrEmpty(mhe.Email))
                    .Join(_context.Users,
                          (mhe) => mhe.UserId,
                          (u) => u.Id,
                          (mhe,u) => new
                          {
                              Email = mhe.Email
                          })
                    .ToListAsync();

                var allMentalHealthExpertEmails = await _context.RegularUsers
                    .Where(ru => !string.IsNullOrEmpty(ru.Email))
                    .Join(_context.Users,
                          (ru) => ru.UserId,
                          (u) => u.Id,
                          (ru,u) => new
                          {
                              Email = ru.Email
                          })
                    .ToListAsync();

                var combinedEmails = allMentalHealthExpertEmails.Union(allRegularUserEmails);

                var emailExists = combinedEmails.Any(e => e.Email == email);

                if (emailExists)
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                    message.To.Add(new MailboxAddress("Recipient", email));
                    message.Subject = "Reset password";
                    message.Body = new TextPart("html")
                    {
                        Text = $@"<p>Klikom na link moći ćete unijeti novu šifru.</p>" +
                        $"" +
                        $"<p>Link za promjenu passworda </p>" +
                        $"<a href='http://localhost:3000/reset-password?safe={_safetyChangeMeasure}&email={email}'>" +
                        $"http://localhost:3000/reset-password?safe={_safetyChangeMeasure}&email={email}" +
                        $"</a>"
                    };

                    using var client = new SmtpClient();
                    client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(smtpHostAddress, smtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);

                    return new Response(email, StatusCodes.Status200OK,EmailLogTypes.SUCCESS.ToString());
                }

                throw new RecordNotFoundException("Email doesn't exist");
            }
            catch (Exception)
            {
                throw;
            }
            
        }


    }
}
