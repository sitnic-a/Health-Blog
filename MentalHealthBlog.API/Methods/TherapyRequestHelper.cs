using MailKit.Net.Smtp;
using MailKit.Security;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils.Email;
using MimeKit;

namespace MentalHealthBlog.API.Methods
{
    public class TherapyRequestHelper
    {
        private readonly IConfiguration _configuration;
        public TherapyRequestHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<Response> SendEmailToInformAboutConnectionRequest(MentalHealthExpert dbMentalHealthExpert, RegularUser dbRegularUser, string? therapyInvitationId = null)
        {

            if (dbMentalHealthExpert == null || dbRegularUser == null)
            {
                throw new ArgumentException("Bad request!");
            }

            var mentalHealthExpertFullName = string.Concat(dbMentalHealthExpert.FirstName, " ", dbMentalHealthExpert.LastName);
            var regularUserFullName = string.Concat(dbRegularUser.FirstName, " ", dbRegularUser.LastName);

            //var applicationUrl = "https://localhost:3000/";
            var applicationUrl = "https://mapp-terapija.com/";

            var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
            var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
            var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
            var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");

            if (string.IsNullOrEmpty(therapyInvitationId))
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                message.To.Add(new MailboxAddress("Recipient", dbMentalHealthExpert.Email));
                message.Subject = "Zahtjev za povezivanje";
                message.Body = new TextPart("html")
                {
                    Text = $@"
                <div>
                    <p> Poštovani/a {mentalHealthExpertFullName}, 
                        <br />
                        <br />
                    </p>
                    
                    <p>
                      <strong style='font-size: 1.05rem'>Dobili ste novi zahtjev za povezivanjem.</strong>
                      <br />
                      <br />
                      <p>Korisnik <strong>{regularUserFullName}</strong> želi da se poveže sa Vama.</p>
                    </p>

                    <div>
                        <p>Direktni pristup aplikaciji možete ostvariti klikom na link: 
                          <a href={applicationUrl}> {applicationUrl}</a>
                          <br />
                          <p>Želimo Vam ugodan ostatak korištenja.
                            <br />
                            <br />
                                Za sva pitanja, kontaktirajte nas putem <strong> support@mapp-terapija.com</strong>
                                <p>Vaš PSIHOnet tim!</p>
                          </p>
                        </p>
                    </div>
                </div>"
                };

                using var client = new SmtpClient();
                client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpHostAddress, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            else
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                message.To.Add(new MailboxAddress("Recipient", dbMentalHealthExpert.Email));
                message.Subject = "Informacije o terapijskom procesu";
                message.Body = new TextPart("html")
                {
                    Text = $@"
                <div>
                    <p> Poštovani/a {mentalHealthExpertFullName}, 
                        <br />
                        <br />
                    </p>
                    
                    <p>
                      <strong style='font-size: 1.05rem'>Vaš terapijski poziv je uspješno izvršen!</strong>
                      <br />
                      <br />
                    </p>
                    <p>Korisnik <strong>{regularUserFullName}</strong> je uspješno kreirao svoj profil. Budući da ste ga pozvali putem aplikacije, 
                       automatski smo Vas povezali. Želimo Vam uspješnu komunikaciju!
                    </p>

                    <div>
                        <p>Direktni pristup aplikaciji možete ostvariti klikom na link: 
                          <a href={applicationUrl}> {applicationUrl}</a>
                          <br />
                          <p>Želimo Vam ugodan ostatak korištenja.
                            <br />
                            <br />
                                Za sva pitanja, kontaktirajte nas putem <strong> support@mapp-terapija.com</strong>
                                <p>Vaš PSIHOnet tim!</p>
                          </p>
                        </p>
                    </div>
                </div>"
                };

                using var client = new SmtpClient();
                client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpHostAddress, smtpPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }



            return new Response(dbMentalHealthExpert.Email, StatusCodes.Status200OK, EmailLogTypes.SUCCESS.ToString());

        }
    }
}
