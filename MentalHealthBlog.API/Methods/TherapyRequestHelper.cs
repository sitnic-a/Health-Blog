using MailKit.Net.Smtp;
using MailKit.Security;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Therapy;
using MentalHealthBlog.API.Utils.Email;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using MimeKit;

namespace MentalHealthBlog.API.Methods
{
    public class TherapyRequestHelper
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ITherapyRequestService> _therapyRequestLoggerService;
        public TherapyRequestHelper(DataContext context, IConfiguration configuration, ILogger<ITherapyRequestService> therapyRequestLoggerService)
        {
            _context = context;
            _configuration = configuration;
            _therapyRequestLoggerService = therapyRequestLoggerService;
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
        public async Task<Response> CallFilterMyExpertsByRequestStatus(SearchTherapyRequestDto query)
        {
            return await FilterMyExpertsByRequestStatus(query);
        }
        public async Task<Response> SendTherapyRequestAsMentalHealthExpertToExistingRegularUser(Models.ResourceRequest.TherapyRequestDto request)
        {
            return await CreateTherapyRequestAsMentalHealthExpertToExistingRegularUser(request);
        }

        private async Task<Response> FilterMyExpertsByRequestStatus(SearchTherapyRequestDto query)
        {
            var dbMentalHealthExpertsFilteredByRequestStatus = new List<MyExpertDto>();
            if (query.RequestStatus != null)
            {
                if (query.IsMentalHealthExpertInviting == true)
                {
                        dbMentalHealthExpertsFilteredByRequestStatus = await _context.TherapyRequests
                   .Where(u => u.RegularUserId == query.LoggedUserId &&
                               u.RequestStatus == query.RequestStatus &&
                               u.IsMentalHealthExpertInviting == true)
                   .Join(_context.MentalHealthExperts,

                         (tr) => tr.MentalHealthExpertId,
                         (mhe) => mhe.UserId,
                         (tr, mhe) => new MyExpertDto
                         {
                             MentalHealthExpertId = mhe.Id,
                             MentalHealthExpertUserId = tr.MentalHealthExpertId,
                             MentalHealthExpert = mhe,
                             RegularUserId = tr.RegularUserId,
                             MentalHealthExpertUsername = _context.Users.SingleOrDefault(u => u.Id == mhe.UserId).Username,
                             MentalHealthExpertFirstName = mhe.FirstName,
                             MentalHealthExpertLastName = mhe.LastName,
                             MentalHealthExpertOrganization = mhe.Organization,
                             MentalHealthExpertEmail = mhe.Email,
                             MentalHealthExpertPhoneNumber = mhe.PhoneNumber,
                             MentalHealthExpertPhotoAsPath = mhe.PhotoAsPath,
                             MentalHealthExpertPhotoAsFile = mhe.PhotoAsFile,
                             RequestStatus = tr.RequestStatus,
                         })
                   .ToListAsync();

                    if (dbMentalHealthExpertsFilteredByRequestStatus != null)
                    {
                        if (dbMentalHealthExpertsFilteredByRequestStatus.Any())
                        {
                            _therapyRequestLoggerService.LogInformation($"MY-EXPERTS/THERAPY-INVITATIONS: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                            return new Response(dbMentalHealthExpertsFilteredByRequestStatus, StatusCodes.Status200OK, TherapyRequestLogTypes.SUCCESS.ToString());
                        }

                        _therapyRequestLoggerService.LogInformation($"MY-EXPERTS/THERAPY-INVITATIONS: {TherapyRequestLogTypes.EMPTY.ToString()}");
                        return new Response(dbMentalHealthExpertsFilteredByRequestStatus, StatusCodes.Status200OK, TherapyRequestLogTypes.EMPTY.ToString());
                    }

                    _therapyRequestLoggerService.LogWarning($"MY-EXPERTS/THERAPY-INVITATIONS: {TherapyRequestLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Invitation not fetched properly!");
                }

                dbMentalHealthExpertsFilteredByRequestStatus = await _context.TherapyRequests
                .Where(u => u.RegularUserId == query.LoggedUserId && u.RequestStatus == query.RequestStatus)
                .Join(_context.MentalHealthExperts,

                      (tr) => tr.MentalHealthExpertId,
                      (mhe) => mhe.UserId,
                      (tr, mhe) => new MyExpertDto
                      {
                          MentalHealthExpertId = mhe.Id,
                          MentalHealthExpertUserId = tr.MentalHealthExpertId,
                          MentalHealthExpert = mhe,
                          RegularUserId = tr.RegularUserId,
                          MentalHealthExpertUsername = _context.Users.SingleOrDefault(u => u.Id == mhe.UserId).Username,
                          MentalHealthExpertFirstName = mhe.FirstName,
                          MentalHealthExpertLastName = mhe.LastName,
                          MentalHealthExpertOrganization = mhe.Organization,
                          MentalHealthExpertEmail = mhe.Email,
                          MentalHealthExpertPhoneNumber = mhe.PhoneNumber,
                          MentalHealthExpertPhotoAsPath = mhe.PhotoAsPath,
                          MentalHealthExpertPhotoAsFile = mhe.PhotoAsFile,
                          RequestStatus = tr.RequestStatus,
                      })
                .ToListAsync();

                if (dbMentalHealthExpertsFilteredByRequestStatus is not null)
                {
                    if (dbMentalHealthExpertsFilteredByRequestStatus.Any())
                    {
                        _therapyRequestLoggerService.LogInformation($"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}", dbMentalHealthExpertsFilteredByRequestStatus);
                        return new Response(dbMentalHealthExpertsFilteredByRequestStatus, StatusCodes.Status200OK, $"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                    }

                    _therapyRequestLoggerService.LogInformation($"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}", dbMentalHealthExpertsFilteredByRequestStatus);
                    return new Response(dbMentalHealthExpertsFilteredByRequestStatus, StatusCodes.Status200OK, $"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                }

                _therapyRequestLoggerService.LogWarning($"MY-EXPERTS: {TherapyRequestLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Couldn't return data!");
            }

            _therapyRequestLoggerService.LogWarning($"MY-EXPERTS: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
            throw new RecordNotFoundException("Bad request!");
        }
        private async Task<Response> CreateTherapyRequestAsMentalHealthExpertToExistingRegularUser(Models.ResourceRequest.TherapyRequestDto request)
        {
            if (request != null)
            {
                var existingTherapyRequest = await _context.TherapyRequests
                    .SingleOrDefaultAsync(tr => tr.RegularUserId == request.RegularUserId &&
                                                tr.MentalHealthExpertId == request.MentalHealthExpertUserId); 

                if (existingTherapyRequest != null)
                {
                    _therapyRequestLoggerService.LogWarning($"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.REQUEST_EXISTS.ToString()}");
                    throw new CreateRecordException("Couldn't create request!");
                }

                var newTherapyRequest = new TherapyRequest(request.RegularUserId, request.MentalHealthExpertUserId, therapyInvitationId: null, isMentalHealthExpertInviting: true);
                var newEntity = await _context.TherapyRequests.AddAsync(newTherapyRequest);
                if (newEntity.Entity != null)
                {
                    await _context.SaveChangesAsync();
                    _therapyRequestLoggerService.LogInformation($"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                    return new Response(newTherapyRequest, StatusCodes.Status201Created, TherapyRequestLogTypes.SUCCESS.ToString());
                }

                _therapyRequestLoggerService.LogWarning($"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.NOT_FOUND.ToString()}");
                throw new CreateRecordException("Request couldn't be created!");
            }

            _therapyRequestLoggerService.LogWarning($"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
            throw new ArgumentException("Bad request!");
        }
    }
}
