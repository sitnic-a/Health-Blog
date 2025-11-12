using AutoMapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using MimeKit;

#pragma warning disable CS8604, CS8602

namespace MentalHealthBlog.API.Services.Subscription
{
    enum SubscriptionLogTypes
    {
        INVALID_DATA,
        SUCCCESS,
        NOT_FOUND,
        SUBSCRIPTION_CREATION_FAILED,
        SUBSCRIPTION_CREATION_SUCCESSFULL
    }
    public class SubscriptionService : ISubscriptionService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ILogger<ISubscriptionService> _subscriptionLoggerService;
        private const int __USER_ROLE_ID__ = 2;
        private const int __PSYCHOLOGIST_PSYCHOTHERAPIST_ROLE_ID__ = 4;
        public SubscriptionService(DataContext context, IConfiguration configuration, IMapper mapper, ILogger<ISubscriptionService> subscriptionLoggerService)
        {
            _context = context;
            _configuration = configuration;
            _mapper = mapper;
            _subscriptionLoggerService = subscriptionLoggerService;
        }

        public async Task<Response> GetUsersTrialPeriod(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    _subscriptionLoggerService.LogWarning($"TRIAL/[userId]: ${SubscriptionLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var trialPeriodDto = new TrialPeriodDto();
                var userHelper = new UserHelper(_context);

                var dbUser = await _context.Users.FindAsync(userId);
                if (dbUser == null)
                {
                    _subscriptionLoggerService.LogWarning($"TRIAL/[userId]: ${SubscriptionLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("User doesn't exist!");
                }

                var dbUserRoles = await userHelper.GetUserRolesAsync(new UserDto(dbUser.Id, dbUser.Username));
                if (dbUserRoles.Any(r => r.Id == __USER_ROLE_ID__))
                {
                    var dbRegularUser = await _context.RegularUsers.SingleOrDefaultAsync(u => u.UserId == userId);
                    trialPeriodDto = _mapper.Map<TrialPeriodDto>(dbRegularUser);
                }
                else if (dbUserRoles.Any(r => r.Id == __PSYCHOLOGIST_PSYCHOTHERAPIST_ROLE_ID__))
                {
                    var dbMentalHealthExpert = await _context.MentalHealthExperts.SingleOrDefaultAsync(mhe => mhe.UserId == userId);
                    trialPeriodDto = _mapper.Map<TrialPeriodDto>(dbMentalHealthExpert);
                }

                if (trialPeriodDto != null)
                {
                    _subscriptionLoggerService.LogInformation($"TRIAL/[userId]: ${SubscriptionLogTypes.SUCCCESS.ToString()}");
                    return new Response(trialPeriodDto, StatusCodes.Status200OK, $"TRIAL/[userId]: ${SubscriptionLogTypes.SUCCCESS.ToString()}");
                }

                _subscriptionLoggerService.LogWarning($"TRIAL/[userId]: ${SubscriptionLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Users trial period not found!");
            }
            catch (Exception e)
            {
                _subscriptionLoggerService.LogError($"TRIAL/[userId]: ${e.Message}");
                throw;
            }

        }
        public async Task<Response> SetTrialToExpired(SubscriptionTrialRequestDto request)
        {
            try
            {
                if (request.UserId <= 0 || request?.IsInTrialPeriod == null || request?.IsMentalHealthExpert == null)
                {
                    _subscriptionLoggerService.LogWarning($"TRIAL-EXPIRED: {SubscriptionLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var userTrialSubscriptionDto = new UserTrialSubscriptionDto();
                if (request.IsMentalHealthExpert)
                {
                    var dbMentalHealthExpert = await _context.MentalHealthExperts.FirstOrDefaultAsync(mhe => mhe.UserId == request.UserId);
                    if (dbMentalHealthExpert == null)
                    {
                        _subscriptionLoggerService.LogWarning($"TRIAL-EXPIRED: {SubscriptionLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Expert is not found!");
                    }
                    dbMentalHealthExpert.IsInTrialPeriod = request.IsInTrialPeriod;
                    dbMentalHealthExpert.IsInformedAboutSubscriptionExpiration = false;
                    await _context.SaveChangesAsync();
                    userTrialSubscriptionDto = _mapper.Map<UserTrialSubscriptionDto>(dbMentalHealthExpert);
                    _subscriptionLoggerService.LogInformation($"TRIAL-EXPIRED: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                    return new Response(userTrialSubscriptionDto, StatusCodes.Status200OK, $"TRIAL-EXPIRED: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                }

                var dbRegularUser = await _context.RegularUsers.FirstOrDefaultAsync(re => re.UserId == request.UserId);
                if (dbRegularUser == null)
                {
                    _subscriptionLoggerService.LogWarning($"TRIAL-EXPIRED: {SubscriptionLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("User is not found");
                }

                dbRegularUser.IsInTrialPeriod = request.IsInTrialPeriod;
                dbRegularUser.IsInformedAboutSubscriptionExpiration = false;
                await _context.SaveChangesAsync();
                userTrialSubscriptionDto = _mapper.Map<UserTrialSubscriptionDto>(dbRegularUser);
                _subscriptionLoggerService.LogInformation($"TRIAL-EXPIRED: {SubscriptionLogTypes.SUCCCESS.ToString()}");
                return new Response(userTrialSubscriptionDto, StatusCodes.Status200OK, $"TRIAL-EXPIRED: {SubscriptionLogTypes.SUCCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _subscriptionLoggerService.LogError($"TRIAL-EXPIRED: {e.Message}");
                throw;
            }
        }
        public async Task<Response> SendTrialExpiringnEmail(TrialPeriodExpiringRequestDto request)
        {
            try
            {
                if (request == null || request.UserId <= 0 || request?.UserRoles.Count <= 0)
                {
                    _subscriptionLoggerService.LogWarning($"TRIAL-EXPIRING(EMAIL NOTIFICATION): {AdminServiceLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var smtpHost = _configuration.GetValue<string>("SMTP_HOST");
                var smtpPort = _configuration.GetValue<int>("SMTP_PORT");
                var smtpHostAddress = _configuration.GetValue<string>("SMTP_HOST_ADDRESS");
                var smtpPassword = _configuration.GetValue<string>("SMTP_PASSWORD");
                var dbMentalHealthExpert = new Models.MentalHealthExpert();
                var dbRegularUser = new Models.RegularUser();
                UserDto userDto = new UserDto();

                if (request.UserRoles.Any(r => r.Id == __PSYCHOLOGIST_PSYCHOTHERAPIST_ROLE_ID__))
                {
                    dbMentalHealthExpert = await _context.MentalHealthExperts.FirstOrDefaultAsync(mhe => mhe.Id == request.UserId);
                    if (dbMentalHealthExpert != null)
                        userDto = _mapper.Map<UserDto>(dbMentalHealthExpert);
                    else
                    {
                        _subscriptionLoggerService.LogWarning($"TRIAL-EXPIRING(EMAIL NOTIFICATION): {SubscriptionLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Data coudln't be properly retrieved !");
                    }
                }
                else if (request.UserRoles.Any(r => r.Id == __USER_ROLE_ID__))
                {
                    dbRegularUser = await _context.RegularUsers.FirstOrDefaultAsync(ru => ru.UserId == request.UserId);
                    if (dbRegularUser != null)
                        userDto = _mapper.Map<UserDto>(dbRegularUser);
                    else
                    {
                        _subscriptionLoggerService.LogWarning($"TRIAL-EXPIRING(EMAIL NOTIFICATION): {SubscriptionLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Data coudln't be properly retrieved !");
                    }
                }

                if (userDto != null)
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("Podrška, Mapp Terapija", smtpHostAddress));
                    message.To.Add(new MailboxAddress("Recipient", userDto.Email));
                    message.Subject = "Informacija o stanju pretplate";
                    message.Body = new TextPart("html")
                    {
                        Text = $@"
                <div>
                    <p> Poštovani/a {string.Concat(userDto.FirstName, " ", userDto.LastName)}, 
                    <br />
                    <br />
                    </p>

                    <p>Ovim putem Vas obavještavamo da Vaša besplatna pretplata ističe za jedan dan.</p>
                    
                    <p>Kada pretplata istekne Vaš profil će se automatski zaključati i nećete biti u mogućnosti pristupiti mu. 
                       Ukoliko želite nastaviti koristiti aplikaciju PSIHOnet i njene pogodnosti, 
                       molimo Vas da uplatite dogovoreni iznos na naš žiro račun.
                    </p>

                    <p>Ukoliko imate nekih pitanja molimo Vas da nas kontaktirate putem email adrese: 
                       <strong>support@mapp-terapija.com</strong>
                       ili putem broja telefona:
                       <strong>+387061629591</strong>
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

                    if (dbMentalHealthExpert != null)
                        dbMentalHealthExpert.IsInformedAboutSubscriptionExpiration = true;

                    if (dbRegularUser != null)
                        dbRegularUser.IsInformedAboutSubscriptionExpiration = true;

                    await _context.SaveChangesAsync();

                    _subscriptionLoggerService.LogInformation($"TRIAL-EXPIRING(EMAIL NOTIFICATION): {SubscriptionLogTypes.SUCCCESS.ToString()}");
                    return new Response(userDto, StatusCodes.Status200OK, $"TRIAL-EXPIRING(EMAIL NOTIFICATION): {SubscriptionLogTypes.SUCCCESS.ToString()}");
                }

                _subscriptionLoggerService.LogWarning($"TRIAL-EXPIRING(EMAIL NOTIFICATION): ${SubscriptionLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("User doesn't exist!");

            }
            catch (Exception e)
            {
                _subscriptionLoggerService.LogError($"TRIAL-EXPIRING(EMAIL NOTIFICATION): {e.Message}");
                throw;
            }
        }

        public async Task<Response> CreateSubscription(CreateSubscriptionDto request)
        {
            try
            {
                if (request.IsCreatingAnAccount == true)
                {
                    if (request.UserId <= 0 || request.SubscriptionPlanId <= 0)
                    {
                        _subscriptionLoggerService.LogWarning($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.INVALID_DATA.ToString()}");
                        throw new ArgumentException("Bad request!");
                    }

                    var newSubscription = _mapper.Map<Models.Subscription>(request);
                    if (newSubscription != null)
                    {
                        var newEntity = await _context.Subscriptions.AddAsync(newSubscription);
                        await _context.SaveChangesAsync();

                        if (newEntity.Entity.Id <= 0)
                        {
                            _subscriptionLoggerService.LogWarning($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUBSCRIPTION_CREATION_FAILED.ToString()}");
                            throw new CreateRecordException("Subscription is not created!");
                        }

                        _subscriptionLoggerService.LogInformation($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUBSCRIPTION_CREATION_SUCCESSFULL.ToString()}");
                        return new Response(newEntity, StatusCodes.Status201Created, $"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUBSCRIPTION_CREATION_SUCCESSFULL.ToString()}");
                    }

                    _subscriptionLoggerService.LogWarning($"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUBSCRIPTION_CREATION_FAILED.ToString()}");
                    throw new CreateRecordException("Subscription couldn't be created!");
                }

                return new Response(new object(), StatusCodes.Status200OK, $"CREATE-SUBSCRIPTION: {SubscriptionLogTypes.SUBSCRIPTION_CREATION_SUCCESSFULL.ToString()}");
                // Create subscription when administrator click paid button
            }
            catch (Exception e)
            {
                _subscriptionLoggerService.LogError($"CREATE-SUBSCRIPTION: {e.Message}");
                throw;
            }
        }
    }
}
