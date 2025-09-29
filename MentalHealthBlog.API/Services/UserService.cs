using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.ExtensionMethods.ExtensionRegularUserClass;
using MentalHealthBlog.API.ExtensionMethods.ExtensionUserClass;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Utils;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

#pragma warning disable CS8602,CS8604

namespace MentalHealthBlog.API.Services
{

    enum UserServiceLogTypes
    {
        USER_NOT_FOUND_OR_NULL,
        USER_EXISTS,
        USER_INVALID_DATA_OR_SOMETHING_ELSE,
        USER_SUCCESFULL,
        USER_FAILED,
        USER_TOKEN_NOT_CREATED,
        ROLES_RETRIEVED,
        ROLES_NOT_FOUND,
        TOKEN_SUCCESSFULLY_CREATED,
        TOKEN_NOT_FOUND,
        TOKEN_ERROR,
        LOGOUT_ERROR,
        PASSWORD_SUCCESSFULLY_CHANGED,
    }
    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _userLoggerService;
        private readonly AppSettings _optionsAppSettings;
        private readonly IOptions<AppSettings> _options;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly DataContext _context;
        private const int __KEYSIZE__ = 128;
        private const int __ITERATIONS = 350000;
        private const int __ADMIN_ROLE__ = 1;
        private const int __USER_ROLE__ = 2;
        private const int __PSYCHOLOGIST_ROLE__ = 4;
        private HashAlgorithmName __HASHALGORITHM__ = HashAlgorithmName.SHA512;
        private User user = new();


        public UserService(DataContext context, IOptions<AppSettings> options, IConfiguration configuration, IMapper mapper, IMemoryCache memoryCache, ILogger<UserService> userLoggerService)
        {
            _context = context;
            _optionsAppSettings = options.Value;
            _options = options;
            _configuration = configuration;
            _mapper = mapper;
            _memoryCache = memoryCache;
            _userLoggerService = userLoggerService;
        }

        public async Task<Response> GetByIdAsync(int id)
        {
            try
            {
                if (id <= 0)
                {
                    _userLoggerService.LogWarning($"GET/id: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", id);
                    throw new ArgumentException("User bad request!");
                }

                var dbUser = await _context.Users.FindAsync(id);
                if (dbUser != null)
                {
                    var userHelper = new UserHelper(_context);

                    var dbUserDto = new UserDto(dbUser.Id, dbUser.Username);
                    if (dbUserDto != null)
                    {
                        var dbUserRoles = await userHelper.GetUserRolesAsync(dbUserDto);
                        if (dbUserRoles.Any())
                        {
                            if (dbUserRoles.Any(r => r.Id == __USER_ROLE__))
                            {
                                dbUserDto.Roles = dbUserRoles;
                                _userLoggerService.LogInformation($"GET/id: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", dbUserDto);
                                return new Response(dbUserDto, StatusCodes.Status200OK, UserServiceLogTypes.USER_SUCCESFULL.ToString());
                            }
                            if (dbUserRoles.Any(r => r.Id == __PSYCHOLOGIST_ROLE__))
                            {
                                var mentalHealthExpert = await _context.MentalHealthExperts.SingleOrDefaultAsync(mhe => mhe.UserId == dbUser.Id);
                                if (mentalHealthExpert != null)
                                {
                                    dbUserDto = new UserDto(dbUser.Username, dbUserRoles,
                                        mentalHealthExpert.PhoneNumber,
                                        mentalHealthExpert.Organization,
                                        mentalHealthExpert.Email,
                                        mentalHealthExpert.PhotoAsFile,
                                        mentalHealthExpert.PhotoAsPath);
                                    dbUserDto.Id = mentalHealthExpert.Id;
                                    dbUserDto.UserId = mentalHealthExpert.UserId;
                                    dbUserDto.FirstName = mentalHealthExpert.FirstName;
                                    dbUserDto.LastName = mentalHealthExpert.LastName;
                                    dbUserDto.Username = dbUser.Username;
                                    _userLoggerService.LogInformation($"GET/id: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", dbUser);
                                    return new Response(dbUserDto, StatusCodes.Status200OK, UserServiceLogTypes.USER_SUCCESFULL.ToString());
                                }
                            }
                        }
                        _userLoggerService.LogWarning($"GET/id: {UserServiceLogTypes.USER_NOT_FOUND_OR_NULL.ToString()}", dbUser);
                        throw new RecordNotFoundException("User should have at least one role!");

                    }
                    _userLoggerService.LogWarning($"GET/id: {UserServiceLogTypes.USER_NOT_FOUND_OR_NULL.ToString()}", dbUser);
                    throw new RecordNotFoundException("Record doesn't exist!");

                }
                _userLoggerService.LogWarning($"GET/id: {UserServiceLogTypes.USER_NOT_FOUND_OR_NULL.ToString()}", dbUser);
                throw new RecordNotFoundException("Record doesn't exist!");
            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"GET/id: {e.Message}");
                throw;
            }
        }
        public async Task<Response> Register(CreateUserDto newUserRequest)
        {
            try
            {
                if (user.IsNotValid(newUserRequest.Username, newUserRequest.Password))
                {
                    _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", new { Username = newUserRequest.Username, Password = newUserRequest.Password });
                    throw new ArgumentException("Bad request while register!");
                }
                var dbUsers = _context.Users;
                var existingUser = await dbUsers.SingleOrDefaultAsync(u => u.Username == newUserRequest.Username) is not null;
                if (existingUser)
                {
                    _userLoggerService.LogWarning($"REGISTER: {UserServiceLogTypes.USER_EXISTS.ToString()}", existingUser);
                    throw new AlreadyRegisteredException("User already registered!");
                }
                var salt = user.GenerateSalt(__KEYSIZE__);
                var hash = user.HashPassword(newUserRequest.Password, salt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
                user.Username = newUserRequest.Username;
                user.PasswordSalt = salt;
                user.PasswordHash = hash;

                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                foreach (var role in newUserRequest.Roles)
                {
                    await _context.UserRoles.AddAsync(new UserRole(user.Id, int.Parse(role.ToString())));
                }

                List<string> mentalHealthExpertsId = new List<string>();

                if (newUserRequest.IsMentalHealthExpert == false)
                {
                    if (newUserRequest?.RegularUser != null)
                    {
                        var newRegularUserRequest = newUserRequest?.RegularUser;
                        if (RegularUserExtension.IsValid(newRegularUserRequest))
                        {
                            var mentalHealthExpertsToConnectWithId = newRegularUserRequest?.MentalHealthExpertsToConnectWithIds;
                            var hasSelectedMentalHealthExperts = mentalHealthExpertsToConnectWithId.Any() &&
                                !mentalHealthExpertsToConnectWithId.Any(e => e == null);
                            if (hasSelectedMentalHealthExperts)
                            {
                                mentalHealthExpertsId = mentalHealthExpertsToConnectWithId[0]
                                   .Split(',')
                                   .ToList();

                                mentalHealthExpertsId.Cast<int>();
                            }

                            var regularUser = new RegularUser(user.Id, newRegularUserRequest.FirstName, newRegularUserRequest.LastName, newRegularUserRequest.Email);
                            await _context.RegularUsers.AddAsync(regularUser);
                            await _context.SaveChangesAsync();

                            if (newRegularUserRequest.IsInTherapy == true && hasSelectedMentalHealthExperts)
                            {
                                foreach (var mentalHealthExpertToConnectWith in mentalHealthExpertsId)
                                {
                                    int MentalHealthExpertId = int.Parse(mentalHealthExpertToConnectWith);
                                    await _context.TherapyRequests.AddAsync(new TherapyRequest(regularUser.UserId, MentalHealthExpertId));
                                }
                                await _context.SaveChangesAsync();
                                _userLoggerService.LogInformation($"REGISTER: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", user);
                                return new Response(new SignedUserDto(user.Id, user.Username), StatusCodes.Status201Created, UserServiceLogTypes.USER_SUCCESFULL.ToString());
                            }
                            _userLoggerService.LogInformation($"REGISTER: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", user);
                            return new Response(new SignedUserDto(user.Id, user.Username), StatusCodes.Status201Created, UserServiceLogTypes.USER_SUCCESFULL.ToString());
                        }
                        _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", new { RegularUser = newRegularUserRequest });
                        throw new CreateRecordException("New user couldn't be created!");
                    }
                    _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", new { Username = newUserRequest.Username, Password = newUserRequest.Password });
                    throw new ArgumentException("Bad request while register!");
                }

                if (newUserRequest.IsMentalHealthExpert == true)
                {
                    var newMentalHealthExpert = _mapper.Map<MentalHealthExpert>(newUserRequest.MentalHealthExpert);
                    if (newMentalHealthExpert is null)
                    {
                        _userLoggerService.LogWarning($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", newMentalHealthExpert);
                        throw new NullReferenceException("Psychologist creation bad request!");
                    }
                    if (newUserRequest.Photo != null)
                    {
                        MemoryStream memoryStream = new MemoryStream();
                        await newUserRequest.Photo.CopyToAsync(memoryStream);
                        var photoAsFile = memoryStream.ToArray();
                        var photoAsString = Convert.ToBase64String(photoAsFile);
                        newMentalHealthExpert.PhotoAsFile = photoAsFile;
                        newMentalHealthExpert.PhotoAsPath = photoAsString;
                    }
                    newMentalHealthExpert.UserId = user.Id;
                    await _context.MentalHealthExperts.AddAsync(newMentalHealthExpert);
                }
                await _context.SaveChangesAsync();
                _userLoggerService.LogInformation($"REGISTER: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", user);
                return new Response(new SignedUserDto(user.Id, user.Username), StatusCodes.Status201Created, UserServiceLogTypes.USER_SUCCESFULL.ToString());

            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"REGISTER: {e.Message}");
                throw;
            }
        }
        public async Task<Response> Login(UserLoginDto loginCredentials)
        {
            try
            {
                if (user.IsNotValid(loginCredentials.Username, loginCredentials.Password))
                {
                    _userLoggerService.LogError($"REGISTER: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", loginCredentials);
                    throw new CreateRecordException("Credentials not valid!");
                }
                var jwtMiddleware = new JWTService(_options, _context, _configuration);
                var authenticated = await VerifyCredentials(loginCredentials);
                var dbUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginCredentials.Username);
                if (authenticated && dbUser is not null)
                {
                    var dbUserRoles = jwtMiddleware.GetRoles(dbUser);
                    var token = jwtMiddleware.GenerateToken(dbUser);
                    var refreshToken = jwtMiddleware.GenerateRefreshToken();

                    if (refreshToken is null)
                    {
                        _userLoggerService.LogError($"LOGIN: {UserServiceLogTypes.USER_TOKEN_NOT_CREATED.ToString()}", token);
                        throw new InvalidTokenException("Refresh token not created!");
                    }

                    dbUser.RefreshTokens.Add(refreshToken);
                    jwtMiddleware.RemoveInactiveAndExpiredTokens(dbUser);
                    await _context.SaveChangesAsync();

                    if (String.IsNullOrEmpty(token))
                    {
                        _userLoggerService.LogError($"LOGIN: {UserServiceLogTypes.USER_TOKEN_NOT_CREATED.ToString()}", token);
                        throw new InvalidTokenException("Token not created");
                    }

                    var responseUser = new SignedUserDto(dbUser.Id, dbUser.Username, token, refreshToken.Token, dbUserRoles);
                    _userLoggerService.LogInformation($"LOGIN: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}", responseUser);
                    return new Response(responseUser, StatusCodes.Status200OK, UserServiceLogTypes.USER_SUCCESFULL.ToString());
                }
                _userLoggerService.LogWarning($"LOGIN: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", $"DB USER: {dbUser}");
                throw new NullReferenceException("User not authenticated!");
            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"LOGIN: {e.Message}");
                throw;
            }
        }
        private async Task<bool> VerifyCredentials(UserLoginDto loginCredentials)
        {
            var dbUsers = _context.Users;
            var existingUser = await dbUsers.SingleOrDefaultAsync(u => u.Username == loginCredentials.Username);
            if (existingUser is not null)
            {
                var hashToCompare = user.HashPassword(loginCredentials.Password, existingUser.PasswordSalt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
                return CryptographicOperations.FixedTimeEquals(Convert.FromBase64String(hashToCompare), Convert.FromBase64String(existingUser.PasswordHash));
            }
            return false;
        }
        public async Task<Response> GetRoles()
        {
            try
            {
                var dbRoles = await _context.Roles.Where(r => r.Name != "Administrator" || r.Name != "Moderator").ToListAsync();
                if (dbRoles.Any() && dbRoles != null)
                {
                    _userLoggerService.LogInformation($"DB_ROLES: {UserServiceLogTypes.ROLES_RETRIEVED.ToString()}", dbRoles);
                    return new Response(dbRoles, StatusCodes.Status200OK, UserServiceLogTypes.ROLES_RETRIEVED.ToString());
                }
                _userLoggerService.LogWarning($"DB_ROLES: {UserServiceLogTypes.ROLES_NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("User should have at least one role!");
            }
            catch (Exception e)
            {
                _userLoggerService.LogWarning($"DB_ROLES: {e.Message}");
                throw;
            }

        }
        public async Task<Response> RefreshAccessToken(string refreshToken)
        {
            try
            {
                var jwtMiddleware = new JWTService(_options, _context, _configuration);
                var accessToken = await jwtMiddleware.RefreshAccessToken(refreshToken);
                if (accessToken.StatusCode == 200 || accessToken.StatusCode == 201)
                {
                    _userLoggerService.LogInformation($"REFRESH-TOKEN: {UserServiceLogTypes.TOKEN_SUCCESSFULLY_CREATED.ToString()}", accessToken);
                    return new Response(accessToken, StatusCodes.Status201Created, UserServiceLogTypes.TOKEN_SUCCESSFULLY_CREATED.ToString());
                }
                _userLoggerService.LogWarning($"REFRESH-TOKEN: {UserServiceLogTypes.USER_TOKEN_NOT_CREATED.ToString()}", accessToken);
                throw new InvalidTokenException("Refresh token not created!");
            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"REFRESH-TOKEN: {e.Message}");
                throw;
            }
        }
        public async Task<Response> Logout(LogoutDto logoutRequest)
        {
            try
            {
                if (logoutRequest is not null)
                {
                    if (!logoutRequest.RefreshToken.IsNullOrEmpty())
                    {
                        var refreshToken = await _context.RefreshTokens
                                            .FirstOrDefaultAsync(t => t.Token == logoutRequest.RefreshToken);
                        if (refreshToken is not null)
                        {
                            refreshToken.RevokedAt = DateTime.UtcNow;

                            var dbRefreshTokensByLoggedUser = _context.RefreshTokens
                                                .Where(rt => rt.UserId == logoutRequest.UserId);

                            _context.RefreshTokens.RemoveRange(dbRefreshTokensByLoggedUser);
                            await _context.SaveChangesAsync();
                            _userLoggerService.LogInformation($"LOGOUT: {UserServiceLogTypes.USER_SUCCESFULL.ToString()}");
                            return new Response(new object(), StatusCodes.Status200OK, UserServiceLogTypes.USER_SUCCESFULL.ToString());
                        }
                        _userLoggerService.LogWarning($"LOGOUT: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", refreshToken);
                        throw new RecordNotFoundException("Refresh token not found!");

                    }
                    _userLoggerService.LogWarning($"LOGOUT: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", logoutRequest.RefreshToken);
                    throw new RecordNotFoundException("Refresh token not found!");

                }
                _userLoggerService.LogWarning($"LOGOUT: {UserServiceLogTypes.USER_INVALID_DATA_OR_SOMETHING_ELSE.ToString()}", logoutRequest);
                throw new ArgumentException("Bad request!");

            }
            catch (Exception e)
            {
                _userLoggerService.LogError($"LOGOUT: {e.Message}");
                throw;
            }
        }

        public async Task<Response> ChangePassword(ChangePasswordDto changePasswordRequest)
        {
            try
            {
                var blueprint = _memoryCache.Get("blueprint");

                if (blueprint == null)
                {
                    throw new ArgumentException("Blueprint is not found!");
                }

                var isTheSame = blueprint.ToString() == changePasswordRequest.Blueprint.ToString();
                if (string.IsNullOrEmpty(changePasswordRequest.Blueprint) || !isTheSame)
                {
                    throw new ArgumentException("Blueprint is not found!");
                }

                var userHelper = new UserHelper(_context);

                var combinedUsers = await userHelper.GetCombinedDataFromMentalHealthExpertsAndRegularUsersAsync();

                var userThatRequestedChange = combinedUsers.FirstOrDefault(u => u.Email == changePasswordRequest.Email);
                if (userThatRequestedChange == null)
                {
                    throw new RecordNotFoundException("User with this email, doesn't exist");
                }

                var dbUserThatRequestedPasswordChange = await _context.Users.FindAsync(userThatRequestedChange.Id);

                if (dbUserThatRequestedPasswordChange == null)
                {
                    throw new RecordNotFoundException("User with this email not found!");
                }

                var passwordSalt = user.GenerateSalt(__KEYSIZE__);
                var passwordHash = user.HashPassword(changePasswordRequest.Password, passwordSalt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);

                dbUserThatRequestedPasswordChange.PasswordSalt = passwordSalt;
                dbUserThatRequestedPasswordChange.PasswordHash = passwordHash;
                _context.Update(dbUserThatRequestedPasswordChange);
                await _context.SaveChangesAsync();
                _memoryCache.Remove("blueprint");
                return new Response(new SignedUserDto(dbUserThatRequestedPasswordChange.Id, dbUserThatRequestedPasswordChange.Username), StatusCodes.Status200OK, UserServiceLogTypes.PASSWORD_SUCCESSFULLY_CHANGED.ToString());
            }
            catch (Exception)
            {
                throw;
            }
            throw new NotImplementedException();
        }
    }
}
