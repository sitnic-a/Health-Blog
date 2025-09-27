using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using static System.Net.WebRequestMethods;

namespace MentalHealthBlog.API.Utils.Email
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SendEmail(string email,string password, string passwordConfirmation)
        {
            var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
            var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
            var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
            var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
            message.To.Add(new MailboxAddress("Recipient", email));
            message.Subject = "Reset password";
            message.Body = new TextPart("html")
            {
                Text = $@"<p>Klikom na link moći ćete unijeti novu šifru.</p>" +
                $"" +
                $"<p>Link za promjenu passworda </p>" +
                $"<a href='https://localhost:3000/reset-password'>" +
                $"https://localhost:3000/reset-password" +
                $"</a>"
            };

            using var client = new SmtpClient();
            client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpHostAddress, smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
    }
}
