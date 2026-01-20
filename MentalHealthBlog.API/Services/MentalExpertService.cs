using AutoMapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.ExtensionMethods.ExtensionAssignmentClass;
using MentalHealthBlog.API.ExtensionMethods.ExtensionTherapyInviteClass;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services.Therapy;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using MimeKit;

#pragma warning disable CS8620
#pragma warning disable CS8602

namespace MentalHealthBlog.API.Services
{
    enum MentalExpertServiceLogTypes
    {
        EMPTY,
        INVALID_DATA,
        ASSIGNMENT_INVALID_DATA,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }

    public class MentalExpertService : IMentalExpertService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger<IMentalExpertService> _mentalExpertLoggerService;
        private readonly ILogger<ITherapyRequestService> _therapyRequestLoggerService;

        public MentalExpertService(DataContext context, IConfiguration configuration, IMapper mapper, ILogger<IMentalExpertService> mentalExpertLoggerService, ILogger<ITherapyRequestService> therapyRequestLoggerService)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _mentalExpertLoggerService = mentalExpertLoggerService;
            _therapyRequestLoggerService = therapyRequestLoggerService;
        }


        public async Task<Response> GetMentalHealthExperts(SearchExpertDto? request)
        {
            try
            {
                var mentalHealthExperts = new List<MentalHealthExpertDto>();
                List<MentalHealthExpert> dbMentalHealthExperts = new List<MentalHealthExpert>();

                if (request is not null)
                {
                    var mentalExpertHelper = new MentalExpertHelper(_context, _mentalExpertLoggerService);
                    return await mentalExpertHelper.CallFilterMentalHealthExpertsBySearchParameter(request);
                }

                dbMentalHealthExperts = await _context.MentalHealthExperts
                    .OrderByDescending(mhe => mhe.FirstName)
                    .Where(mhe => mhe.IsApproved == true)
                    .ToListAsync();

                if (!dbMentalHealthExperts.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("No records found in database");
                }

                foreach (var dbMentalHealthExpert in dbMentalHealthExperts)
                {
                    var mentalHealthExpertDto = _mapper.Map<MentalHealthExpertDto>(dbMentalHealthExpert);

                    if (mentalHealthExpertDto == null)
                    {
                        _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new EmptyListException("Mental health expert doesn't exist");
                    }
                    mentalHealthExperts.Add(mentalHealthExpertDto);
                }

                if (!mentalHealthExperts.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("Experts are not found!");
                }

                _mentalExpertLoggerService.LogInformation($"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                return new Response(mentalHealthExperts, StatusCodes.Status200OK, $"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"EXPERTS: {e.Message}", e);
                throw;
            }

        }
        public async Task<Response> GetSharesPerUser(ExpertSearchContentDto query)
        {
            try
            {
                if (query == null || query.LoggedExpertId <= 0)
                {
                    _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.ERROR.ToString()} - QUERY NULL OR WRONG", query);
                    throw new ArgumentException("Bad request!");
                }

                var mentalHealthExpert = await _context.MentalHealthExperts
                    .SingleOrDefaultAsync(mhe => mhe.UserId == query.LoggedExpertId);

                var dbShares = await _context.Shares
                    .Where(mhe => mhe.SharedWithId == mentalHealthExpert.Id &&
                                  mhe.IsKeepingContent == null)
                    .Include(p => p.SharedPost)
                    .Include(u => u.SharedPost.User)
                    .ToListAsync();

                var isSharedWithThisMentalHealthExpert = dbShares.Any();

                if (!isSharedWithThisMentalHealthExpert)
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    return new Response(new List<SharesPerUserDto>(), StatusCodes.Status200OK, $"SHARES-PER-USER: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                }

                var groupedUsersAndTheirShares = dbShares
                    .DistinctBy(p => new
                    {
                        p.SharedPostId,
                        p.SharedWithId
                    })
                    .GroupBy(u => u.SharedPost.User);

                if (!groupedUsersAndTheirShares.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Content shared with this mental health expert not available!");
                }

                List<SharesPerUserDto> sharesPerUser = await FillListGroupedUsersAndTheirShares(groupedUsersAndTheirShares);

                if (isSharedWithThisMentalHealthExpert && !sharesPerUser.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Shares not fetched properly!");
                }

                _mentalExpertLoggerService.LogInformation($"SHARES-PER-USER: {MentalExpertServiceLogTypes.SUCCESS.ToString()}", sharesPerUser);
                return new Response(sharesPerUser, StatusCodes.Status200OK, MentalExpertServiceLogTypes.SUCCESS.ToString());

            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {e.Message}");
                throw;
            }
        }
        public async Task<Response> GetUsersWithSetAssignments(ExpertSearchContentDto query)
        {
            try
            {
                if (query == null || query.LoggedExpertId <= 0)
                {
                    _mentalExpertLoggerService.LogError($"USERS-WITH-SET-ASSIGNMENTS: {MentalExpertServiceLogTypes.ERROR.ToString()} - QUERY NULL OR WRONG", query);
                    throw new ArgumentException("Bad request!");
                }

                var usersInTherapy = await _context.TherapyRequests
                    .Where(tr => tr.MentalHealthExpertId == query.LoggedExpertId &&
                                 tr.RequestStatus == RequestStatusEnum.Approved)
                    .ToListAsync();

                var dbAssignments = new List<Assignment>();

                foreach (var userInTherapy in usersInTherapy)
                {
                    var usersAssignments = await _context.Assignments
                         .Where(a => a.AssignmentGivenToId == userInTherapy.RegularUserId)
                         .ToListAsync();

                    dbAssignments.AddRange(usersAssignments);
                }

                if (!dbAssignments.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"USERS-WITH-SET-ASSIGNMENTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    return new Response(dbAssignments, StatusCodes.Status200OK, $"USERS-WITH-SET-ASSIGNMENTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                }

                var groupedUsersWithAssignments = dbAssignments
                    .GroupBy(a => a.AssignmentGivenToId);

                var usersWithAssignments = new List<UserDto>();
                foreach (var user in groupedUsersWithAssignments)
                {
                    var dbUser = await _context.Users.FindAsync(user.Key);
                    var dbRegularUser = await _context.RegularUsers.FindAsync(user.Key);
                    var userDto = new UserDto
                    {
                        Id = dbUser.Id,
                        Username = dbUser.Username,
                        FirstName = dbRegularUser.FirstName,
                        LastName = dbRegularUser.LastName,
                        Email = dbRegularUser.Email
                    };

                    usersWithAssignments.Add(userDto);
                }

                if (groupedUsersWithAssignments.Any() && !usersWithAssignments.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"USERS-WITH-SET-ASSIGNMENTS:{MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Users with assignments are not properly filled!");
                }

                _mentalExpertLoggerService.LogInformation($"USERS-WITH-SET-ASSIGNMENTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                return new Response(usersWithAssignments, StatusCodes.Status200OK, $"USERS-WITH-SET-ASSIGNMENTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"USERS-WITH-SET-ASSIGNMENTS: {e.Message}");
                throw;
            }

        }
        public async Task<Response> CreateAssignment(CreateAssignmentDto request)
        {
            try
            {
                if (!request.IsValid())
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString()}", request);
                    throw new ArgumentException("Bad request!");
                }

                var dbMentalHealthExpert = await _context.MentalHealthExperts
                        .FirstOrDefaultAsync(mhe => mhe.UserId == request.AssignmentGivenById);

                if (dbMentalHealthExpert == null)
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}", dbMentalHealthExpert);
                    throw new RecordNotFoundException("Couldn't create an assignment!");
                }

                var newAssignment = new Assignment(request.AssignmentGivenToId, dbMentalHealthExpert.UserId, request.Content, DateTime.UtcNow);

                if (newAssignment == null)
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString()}", newAssignment);
                    throw new CreateRecordException("Assignment can't be created!");
                }

                await _context.Assignments.AddAsync(newAssignment);
                await _context.SaveChangesAsync();

                _mentalExpertLoggerService.LogInformation($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.SUCCESS.ToString()}", newAssignment);
                return new Response(newAssignment, StatusCodes.Status201Created, MentalExpertServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"GIVE-ASSIGNMENT: {e.Message}");
                throw;
            }
        }
        public async Task<Response> GetInvitationById(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                {
                    _mentalExpertLoggerService.LogWarning($"INVITE/[id]: {MentalExpertServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var invitation = await _context.TherapyInvites.FindAsync(id);
                if (invitation == null)
                {
                    _mentalExpertLoggerService.LogWarning($"INVITE/[id]: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Invitation not found!");
                }

                _mentalExpertLoggerService.LogInformation($"INVITE/[id]: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                return new Response(invitation, StatusCodes.Status200OK, MentalExpertServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"INVITE/[id]: {e.Message}");
                throw;
            }
        }
        public async Task<Response> CreateInvite(InviteDto request)
        {
            try
            {
                if (!request.IsRequestForTherapyValid())
                {
                    _mentalExpertLoggerService.LogWarning($"Creating regular user invite - {MentalExpertServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var userHelper = new UserHelper(_context);
                var userWithAccount = await _context.RegularUsers
                    .FirstOrDefaultAsync(ru => ru.Email == request.SendEmailTo);
                bool isRegularUserAlreadyRegistered = userWithAccount != null;
                TherapyInvite newInvite;
                var newInviteGuidAsGuid = Guid.NewGuid();
                var newInviteGuid = newInviteGuidAsGuid
                    .ToString("N")
                    .Substring(0, 9);

                if (isRegularUserAlreadyRegistered)
                {
                    newInvite = new TherapyInvite(newInviteGuid, request.MentalHealthExpertId, isRegularUserAlreadyRegistered, userWithAccount.UserId);
                    await _context.TherapyInvites.AddAsync(newInvite);
                    await _context.SaveChangesAsync();

                    if (newInvite != null)
                    {
                        _mentalExpertLoggerService.LogInformation($"Creating regular user invite - {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                        return new Response(newInvite, StatusCodes.Status201Created, MentalExpertServiceLogTypes.SUCCESS.ToString());
                    }

                    _mentalExpertLoggerService.LogWarning($"Creating regular user invite - {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new CreateRecordException("Invite not created!");
                }

                newInvite = new TherapyInvite(newInviteGuid, request.MentalHealthExpertId, isRegularUserAlreadyRegistered, null);
                await _context.TherapyInvites.AddAsync(newInvite);
                await _context.SaveChangesAsync();

                if (newInvite != null)
                {
                    _mentalExpertLoggerService.LogInformation($"Creating regular user invite - {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                    return new Response(newInvite, StatusCodes.Status201Created, MentalExpertServiceLogTypes.SUCCESS.ToString());
                }

                _mentalExpertLoggerService.LogWarning($"Creating regular user invite - {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                throw new CreateRecordException("Invite not created!");
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"Creating regular user invite - {e.Message}");
                throw;
            }
        }
        public async Task<Response> SendInviteToUser(InviteDto request)
        {

            try
            {
                var newInviteResponse = await CreateInvite(request);
                var newInviteServiceResponseObject = newInviteResponse.ServiceResponseObject as TherapyInvite;

                if (newInviteResponse.StatusCode == StatusCodes.Status201Created &&
                    newInviteServiceResponseObject != null &&
                    newInviteServiceResponseObject.IsRegularUserAlreadyUsingApplication == false)
                {
                    _mentalExpertLoggerService.LogInformation($"INVITE/USER: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                    return await SendInvitationEmailToUser(request, newInviteServiceResponseObject);
                }

                if (newInviteResponse.StatusCode == StatusCodes.Status201Created &&
                    newInviteServiceResponseObject != null &&
                    newInviteServiceResponseObject.IsRegularUserAlreadyUsingApplication == true)
                {
                    var therapyRequestHandler = new TherapyRequestHelper(_context, _configuration, _therapyRequestLoggerService);
                    
                    // Razmisliti da li je potrebna provjera da li postoje dva ili vise eksperta i na osnovu zakljucka implementirati ostatak funkcionalnosti
                    // Za sada drzati zakomentarisan kod prebrojavanja ( blok kod i provjera Count > _MAX_EXPERTS)
                    
                    /*
                    const int __MAX_EXPERTS_IN_THERAPY__ = 2;
                    var queryForMyApprovedExperts = new SearchTherapyRequestDto(newInviteServiceResponseObject.RegularUserId.Value, RequestStatusEnum.Approved);
                    var myApprovedExpertsResponse = await therapyRequestHandler.CallFilterMyExpertsByRequestStatus(queryForMyApprovedExperts);
                    var myApprovedExperts = myApprovedExpertsResponse.ServiceResponseObject as List<MyExpertDto>;

                    var queryForMyPendingExperts = new SearchTherapyRequestDto(newInviteServiceResponseObject.RegularUserId.Value, RequestStatusEnum.Pending);
                    var myPendingExpertsResponse = await therapyRequestHandler.CallFilterMyExpertsByRequestStatus(queryForMyPendingExperts);
                    var myPendingExperts = myPendingExpertsResponse.ServiceResponseObject as List<MyExpertDto>;

                    var myExpertsUnion = myApprovedExperts.Union(myPendingExperts).ToList();
                    */

                    //if (myExpertsUnion.Count >= __MAX_EXPERTS_IN_THERAPY__)
                    //{
                        var newTherapyRequest = new Models.ResourceRequest.TherapyRequestDto
                        {
                            RegularUserId = newInviteServiceResponseObject.RegularUserId.Value,
                            MentalHealthExpertUserId = request.MentalHealthExpertId,
                            IsMentalHealthExpertInvitingRegularUser = true,
                        };
                        return await therapyRequestHandler.SendTherapyRequestAsMentalHealthExpertToExistingRegularUser(newTherapyRequest);
                    //}
                }

                _mentalExpertLoggerService.LogWarning($"INVITE/USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Invitation not found!");
            }
            catch (Exception e)
            {

                throw;
            }

            /*
                1) Dodati invite tabelu na bazu
                2) Pripremiti novokreirani invite kao record i snimiti ga
                3) Poslati email osobi
                4) Pripremiti drugu controller rutu na kojoj ce se raditi redirekcija i
                   slati na frontend odakle ce korisnik dobijati iz cookiea podatke i na taj nacin moci da se registruje
                5) Po uspjesnoj registraciji ako korisnik nije postojao u aplikaciji snimiti promjenu na rekordu na nacin da se pohrani koji
                  je korisnik pozvan od strane kojeg strucnjaka kako bi se mogla voditi statistika 
            */
        }
        public async Task<Response> SendInvitationEmailToUser(InviteDto request, TherapyInvite invite)
        {
            try
            {
                if (!request.IsRequestForTherapyValid() || !invite.IsTherapyInviteValid())
                {
                    _mentalExpertLoggerService.LogWarning($"INVITE/USER: {MentalExpertServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }


                var dbMentalHealthExpert = await _context.MentalHealthExperts
                    .FirstOrDefaultAsync(mhe => mhe.UserId == request.MentalHealthExpertId);

                if (dbMentalHealthExpert == null)
                {
                    _mentalExpertLoggerService.LogWarning($"INVITE/USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Mental health expert is not found!");
                }

                var invitationUrl = $"https://localhost:7029/invite/{invite.Id}";
                //var invitationUrl = $"https://mapp-terapija/invite/{invite.Id}";

                var MentalHealthExpertFullName = string.Concat(dbMentalHealthExpert.FirstName, " ", dbMentalHealthExpert.LastName);

                var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
                var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
                var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
                var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                message.To.Add(new MailboxAddress("Recipient", request.SendEmailTo));
                message.Subject = "Zahtjev za terapijski proces";
                message.Body = new TextPart("html")
                {
                    Text = $@"
                <div>
                    <p>Poštovani/a,</p>
                    
                    <h3>Dobili ste novi zahtjev za terapijski proces </h3>
                    <p>Doktor/ica <strong>{MentalHealthExpertFullName}</strong> Vam je poslao zahtjev za terapijski proces!</p>
                    
                    <p>Ukoliko ste već registrovani, zahtjev možete pregledati na Vašem profilu.</p>
                    <p>Ukoliko niste, klikom na link ispod možete se registrovati na aplikaciju koja će Vas 
                       automatski povezati sa doktorom {MentalHealthExpertFullName} s kojim ćete ubuduće moći 
                       komunicirati do trenutka kada poželite prekinuti Vaš proces. 
                    </p>
                    <br>

                    <p>Link za registraciju na aplikaciju {invitationUrl}</p>
                    <br>
                    <p>Za sve dodatne informacije, pomoć ili neko drugo pitanje kontaktirajte Udruženje Menssana ili svoga doktora</p>

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

                return new Response(request.SendEmailTo, StatusCodes.Status200OK, $"INVITE/USER: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"INVITE/USER: {e.Message}");
                throw;
            }
        }
        private async Task<List<SharesPerUserDto>> FillListGroupedUsersAndTheirShares(IEnumerable<IGrouping<User, Share>> groupedUsersAndTheirShares)
        {
            try
            {
                List<SharesPerUserDto> sharesPerUser = new List<SharesPerUserDto>();
                ShareHelper shareHelper = new ShareHelper(_context);

                foreach (var userFromGroup in groupedUsersAndTheirShares)
                {
                    var dbUserByKey = await _context.Users.FindAsync(userFromGroup.Key.Id);
                    UserDto userThatSharedContent;

                    if (dbUserByKey is not null)
                    {
                        userThatSharedContent = new UserDto(dbUserByKey.Id, dbUserByKey.Username);
                        if (userThatSharedContent == null)
                        {
                            _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND}");
                            throw new RecordNotFoundException("User not found!");
                        }

                        List<PostDto> contentUserShared = await shareHelper.CallFillByUsersSharedContentForMentalHealthExpertPreviewAsync(userFromGroup, new List<PostDto>());

                        if (!contentUserShared.Any())
                        {
                            _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                            throw new RecordNotFoundException("Shares aren't populated properly!");
                        }

                        sharesPerUser.Add(new SharesPerUserDto(userThatSharedContent, contentUserShared));
                        continue;
                    }

                    _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND}");
                    throw new RecordNotFoundException("Couldn't populate the shares per user list! User not found.");
                }

                return sharesPerUser;
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {e.Message}");
                throw;
            }
        }

    }
}

