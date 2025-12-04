using AutoMapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils.Email;
using MentalHealthBlog.API.Utils.Filtering.Dashboards.Admin;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;

#pragma warning disable CS8604

namespace MentalHealthBlog.API.Services
{
    enum AdminServiceLogTypes
    {
        INVALID_DATA,
        EMPTY,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }
    public class AdminService : IAdminService
    {
        private readonly DataContext _context;
        private IConfiguration _configuration;
        private ILogger<AdminService> _adminLoggerService;
        private IMapper _mapper;
        private string MentalHealthExpertName { get; set; } = string.Empty;

        public AdminService(DataContext context, IConfiguration configuration, IMapper mapper, ILogger<AdminService> adminLoggerService)
        {
            _context = context;
            _configuration = configuration;
            _adminLoggerService = adminLoggerService;
            _mapper = mapper;
        }

        public async Task<Response> Get(SearchUserDto? query = null)
        {
            try
            {
                AdminDashboardFilter filter = new AdminDashboardFilter(_context, _adminLoggerService, _mapper);

                var users = new List<UserDto>();
                const int __USER_ROLE__ = 2;
                const int __MENTAL_HEALTH_EXPERT_ROLE__ = 4;

                var dbUsers = await _context.Users.ToListAsync();
                var usersTableHasRecords = dbUsers.Any();

                if (!usersTableHasRecords)
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.EMPTY.ToString()}");
                    return new Response(new List<UserDto>(), StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                }
                //Exception handling za dio kada smo unijeli query pretragu je ostao neuraden

                if (query?.Role > 0)
                {
                    if (query.Role == __USER_ROLE__)
                    {
                        users = await filter.CallGetRegularUsers(query);

                        if (!users.Any())
                        {
                            _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.EMPTY.ToString()}", users);
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                        }
                        else if (users.Any())
                        {
                            _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}");
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                        }
                    }

                    if (query.Role == __MENTAL_HEALTH_EXPERT_ROLE__)
                    {
                        users = await filter.CallGetMentalHealthExpert(query);
                        if (users.Any())
                        {
                            _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}");
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                        }
                        else
                        {
                            _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.EMPTY.ToString()}");
                            return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                        }
                    }
                }

                users = await filter.CallGetUnfilteredUsers(dbUsers);
                if (usersTableHasRecords && !users.Any())
                {
                    _adminLoggerService.LogWarning($"GET: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Users not fetched properly!");
                }

                _adminLoggerService.LogInformation($"GET: {AdminServiceLogTypes.SUCCESS.ToString()}", users);
                return new Response(users, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"GET: {e.Message}");
                throw;
            }

        }
        public async Task<Response> GetNewRegisteredExperts(SearchExpertDto? query = null)
        {
            try
            {
                var dbMentalHealthExperts = await _context.MentalHealthExperts
                    .Where(mhe => mhe.IsApproved == false && mhe.IsRejected == false)
                    .DistinctBy(mhe => new { mhe.Email })
                    .OrderByDescending(mhe => mhe.RegisteredAt)
                    .ToListAsync();

                var registeredNewMentalHealthExperts = dbMentalHealthExperts.Any();

                if (query is not null)
                {
                    if (query.Status == true)
                    {
                        dbMentalHealthExperts = await _context.MentalHealthExperts
                            .Where(mhe => mhe.IsApproved == true)
                            .DistinctBy(mhe => new { mhe.Email })
                            .OrderByDescending(mhe => mhe.RegisteredAt)
                            .ToListAsync();
                    }
                    else if (query.Status == false)
                    {
                        dbMentalHealthExperts = await _context.MentalHealthExperts
                            .Where(mhe => mhe.IsRejected == true)
                            .DistinctBy(mhe => new { mhe.Email })
                            .OrderByDescending(mhe => mhe.RegisteredAt)
                            .ToListAsync();
                    }
                }

                if (!registeredNewMentalHealthExperts && query == null)
                {
                    _adminLoggerService.LogWarning($"NEW-REQUEST: {AdminServiceLogTypes.EMPTY.ToString()}", dbMentalHealthExperts);
                    return new Response(new List<MentalHealthExpertDto>(), StatusCodes.Status200OK, AdminServiceLogTypes.EMPTY.ToString());
                }

                List<MentalHealthExpertDto> mentalHealthExperts = new List<MentalHealthExpertDto>();
                var userHelper = new UserHelper(_context);

                foreach (var dbMentalHealthExpert in dbMentalHealthExperts)
                {
                    var mentalHealthExpert = _mapper.Map<MentalHealthExpertDto>(dbMentalHealthExpert);
                    var mentalHealthExpertAsUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == mentalHealthExpert.UserId);

                    if (mentalHealthExpert != null && mentalHealthExpertAsUser != null)
                    {
                        mentalHealthExpert.Username = mentalHealthExpertAsUser.Username;
                        mentalHealthExperts.Add(mentalHealthExpert);
                        continue;
                    }

                    _adminLoggerService.LogWarning($"NEW-REQUEST: {AdminServiceLogTypes.NOT_FOUND.ToString()}", mentalHealthExpert);
                    throw new RecordNotFoundException("User not found!");
                }

                _adminLoggerService.LogInformation($"NEW-REQUEST: {AdminServiceLogTypes.SUCCESS.ToString()}", mentalHealthExperts);
                return new Response(mentalHealthExperts, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"NEW-REQUEST: {e.Message}");
                throw;
            }
        }
        public async Task<Response> SetRegisteredExpertStatus(RegisterExpertPatchDto patchDto)
        {
            try
            {
                if (patchDto == null)
                {
                    _adminLoggerService.LogWarning($"APPROVAL: {AdminServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbMentalHealthExpert = await _context.MentalHealthExperts
                    .FirstOrDefaultAsync(u => u.UserId == patchDto.MentalHealthExpertId);

                if (dbMentalHealthExpert != null)
                {
                    MentalHealthExpertName = dbMentalHealthExpert.FirstName;
                    dbMentalHealthExpert.IsApproved = patchDto.IsApproved;

                    if (dbMentalHealthExpert.IsApproved == true)
                    {
                        dbMentalHealthExpert.ApprovedAt = DateTime.UtcNow;
                        await SendApprovedEmail(dbMentalHealthExpert.Email);
                    }

                    dbMentalHealthExpert.IsRejected = patchDto.IsRejected;

                    if (dbMentalHealthExpert.IsRejected == true)
                    {
                        await SendRejectedEmail(dbMentalHealthExpert.Email);
                    }

                    await _context.SaveChangesAsync();
                    var dbMentalHealthExperts = await GetNewRegisteredExperts();
                    return new Response(dbMentalHealthExperts, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                }

                _adminLoggerService.LogWarning($"APPROVAL: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Couldn't set new status!");
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"APPROVAL: {e.Message}");
                throw;
            }
        }
        public async Task<Response> RemoveUserById(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    _adminLoggerService.LogWarning($"DELETE/id: {AdminServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbUser = await _context.Users.FindAsync(userId);
                if (dbUser != null)
                {
                    const int __PSYCHOLOGIST_ROLE__ = 4;
                    var userHelper = new UserHelper(_context);
                    var dbUserDto = _mapper.Map<UserDto>(dbUser);
                    var roles = await userHelper.GetUserRolesAsync(dbUserDto);

                    if (roles.IsNullOrEmpty())
                    {
                        _adminLoggerService.LogWarning($"DELETE/id: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("User not deleted. Roles are missing!");
                    }

                    var mentalHealthExpert = await _context.MentalHealthExperts.FirstOrDefaultAsync(mhe => mhe.UserId == dbUser.Id);
                    if (mentalHealthExpert == null && roles.Any(r => r.Id == __PSYCHOLOGIST_ROLE__))
                    {
                        _adminLoggerService.LogWarning($"DELETE/id: {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("User not deleted. Mental health expert not found!");
                    }
                    else if (mentalHealthExpert != null && roles.Any(r => r.Id == __PSYCHOLOGIST_ROLE__))
                    {
                        var removedMentalHealthExpert = _context.MentalHealthExperts.Remove(mentalHealthExpert);
                        var removedMentalHealthExpertAsUser = _context.Users.Remove(dbUser);
                        //Razmisliti da li je potrebno brisati zadane zadatke u slucaju da se obrise mental health user
                        await _context.SaveChangesAsync();
                        _adminLoggerService.LogInformation($"DELETE/id: {AdminServiceLogTypes.SUCCESS.ToString()}", mentalHealthExpert);
                        return new Response(mentalHealthExpert, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                    }

                    var removedUser = _context.Users.Remove(dbUser);
                    await _context.SaveChangesAsync();
                    _adminLoggerService.LogInformation($"DELETE/id: {AdminServiceLogTypes.SUCCESS.ToString()}", dbUser);
                    return new Response(dbUser, StatusCodes.Status200OK, AdminServiceLogTypes.SUCCESS.ToString());
                }

                _adminLoggerService.LogWarning($"DELETE/id: {AdminServiceLogTypes.NOT_FOUND.ToString()}", dbUser);
                throw new RecordNotFoundException("User can't be deleted. User not found!");
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"DELETE/id: {e.Message}");
                throw;
            }
        }
        public async Task<Response> SendApprovedEmail(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    _adminLoggerService.LogWarning($"APPROVAL(EMAIL NOTIFICATION): {AdminServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                //var applicationUrl = "http://localhost:3000";
                var applicationUrl = "https://mapp-terapija.com";

                var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
                var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
                var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
                var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");

                var emailExists = _context.MentalHealthExperts.Any(mhe => mhe.Email == email);


                if (emailExists)
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                    message.To.Add(new MailboxAddress("Recipient", email));
                    message.Subject = "Informacija o statusu profila";
                    message.Body = new TextPart("html")
                    {
                        Text = $@"
                <div>
                    <p> Poštovani/a {MentalHealthExpertName}, 
                        <br />
                        <br />
                        <br />
                        Zadovoljstvo nam je što možemo da Vas informišemo da je Vaš profil
                        uspješno aktiviran!
                      </p>

                    <p> U periodu od narednih sedam(7) dana moći ćete koristiti svoj profil besplatno. 
                       Nakon sedam dana Vaš profil će se automatski zaključati ukoliko ne izvršite uplatu. 
                       Uplate se vrše putem žiro računa u nastavku.
                     </p>

                    <p style='margin-block:0.2rem'>Ime organizacije: A.R.T Menssana</p>
                    <p style='margin-block:0.2rem'>Žiro račun: 1540012024363683</p>
                    <p style='margin-block:0.2rem'>Adresa: Branilaca Sarajeva 51, 71000 Sarajevo</p>

                    <div>
                        <p>Direktni pristup aplikaciji možete ostvariti klikom na link ispod: 
                          <br />
                          <a href={applicationUrl}>{applicationUrl}</a>
                        </p>

                        <p>Za sva dodatna pitanja, sugestije ili primjedbe možete nas
                          kontaktirati na email
                          <strong> support@mapp-terapija.com</strong>
                        </p>

                        <p>Želimo Vam ugodno korištenje aplikacije!</p>
                        <p>Vaš PSIHOnet tim!</p>
                    </div>
                </div>"
                    };

                    using var client = new SmtpClient();
                    client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(smtpHostAddress, smtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);

                    _adminLoggerService.LogInformation($"APPROVAL(EMAIL-NOTIFICATION): {AdminServiceLogTypes.SUCCESS.ToString()}");
                    return new Response(email, StatusCodes.Status200OK, EmailLogTypes.SUCCESS.ToString());
                }
                _adminLoggerService.LogWarning($"APPROVAL(EMAIL-NOTIFICATION): {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("User not found!");
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"APPROVAL(EMAIL-NOTIFICATION): {e.Message}");
                throw;
            }
        }
        public async Task<Response> SendRejectedEmail(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email))
                {
                    _adminLoggerService.LogWarning($"APPROVAL(EMAIL NOTIFICATION): {AdminServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
                var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
                var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
                var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");

                var emailExists = _context.MentalHealthExperts.Any(mhe => mhe.Email == email);

                if (emailExists)
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                    message.To.Add(new MailboxAddress("Recipient", email));
                    message.Subject = "Informacija o statusu profila";
                    message.Body = new TextPart("html")
                    {
                        Text = $@"
                <div>
                    <p> Poštovani/a {MentalHealthExpertName}, 
                    <br />
                    <br />
                    </p>

                    <p>Ovim putem Vas obavještavamo da Vaš profil nažalost nije moguće aktivirati ovaj put.</p>
                    
                    <p>Ukoliko želite više informacija o razlogu, možete nas kontaktirati putem 
                       <strong> support@mapp-terapija.com</strong>{' '} ili da nas posjetite na adresi
                       <strong>{' '}Branilaca Sarajeva 51, 71000 Sarajevo - A.R.T. Menssana</strong>
                    </p>

                    <div>
                       <p>Želimo Vam ugodan ostatak dana!</p>
                       <p>Vaš PSIHOnet tim!</p>
                    </div>
                </div>"
                    };

                    using var client = new SmtpClient();
                    client.Connect(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(smtpHostAddress, smtpPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);

                    _adminLoggerService.LogInformation($"APPROVAL(EMAIL-NOTIFICATION): {AdminServiceLogTypes.SUCCESS.ToString()}");
                    return new Response(email, StatusCodes.Status200OK, EmailLogTypes.SUCCESS.ToString());
                }

                _adminLoggerService.LogWarning($"APPROVAL(EMAIL-NOTIFICATION): {AdminServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("User not found!");
            }
            catch (Exception e)
            {
                _adminLoggerService.LogError($"APPROVAL(EMAIL-NOTIFICATION): {e.Message}");
                throw;
            }
        }
    }
}
