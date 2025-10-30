using MailKit.Net.Smtp;
using MailKit.Security;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly IMemoryCache _memoryCache;
        private Guid _safetyChangeMeasure;

        public EmailService(DataContext context, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _context = context;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }
        public async Task<Response> SendEmail(object paramRequest)
        {
            try
            {
                if (paramRequest != null)
                {
                    RequestChangePasswordDto request = (RequestChangePasswordDto)paramRequest;

                    if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Username))
                    {
                        throw new ArgumentException("Bad request!");
                    }

                    //var applicationUrl = "http://localhost:3000";
                    var applicationUrl = "https://mapp-terapija.com";

                    _safetyChangeMeasure = Guid.NewGuid();
                    _memoryCache.Set("blueprint", _safetyChangeMeasure, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                    });

                    var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
                    var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
                    var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
                    var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");

                    var userHelper = new UserHelper(_context);
                    var combinedUsers = await userHelper.GetCombinedDataFromMentalHealthExpertsAndRegularUsersAsync();

                    var emailExists = combinedUsers.Any(e => e.Username == request.Username &&
                                                             e.Email == request.Email);

                    if (emailExists)
                    {
                        var message = new MimeMessage();
                        message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                        message.To.Add(new MailboxAddress("Recipient", request.Email));
                        message.Subject = "Reset password";
                        message.Body = new TextPart("html")
                        {
                            Text = $@"<p>Klikom na link moći ćete unijeti novu šifru.</p>" +
                            $"" +
                            $"<p>Link za promjenu passworda </p>" +
                            $"<a href='{applicationUrl}/reset-password?safe={_safetyChangeMeasure}&email={request.Email}&username={request.Username}'>" +
                            $"{applicationUrl}/reset-password?safe={_safetyChangeMeasure}&email={request.Email}&username={request.Username}" +
                            $"</a>"
                        };

                        using var client = new SmtpClient();
                        client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                        await client.AuthenticateAsync(smtpHostAddress, smtpPassword);
                        await client.SendAsync(message);
                        await client.DisconnectAsync(true);

                        return new Response(request, StatusCodes.Status200OK, EmailLogTypes.SUCCESS.ToString());
                    }

                    throw new RecordNotFoundException("User doesn't exist");
                }

                throw new ArgumentException("Bad request!");
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}
