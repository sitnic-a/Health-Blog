using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MentalHealthBlog.API.Utils
{
    enum JWTServiceLogTypes
    {
        CREATED_ACCESS_TOKEN,
        EMPTY_OR_NULL,
        NOT_FOUND,
        EXPIRED_REFRESH_TOKEN,
        ERROR
    }
    public class JWTService
    {
        private readonly AppSettings _options;
        private readonly DataContext _context;

        private string CreateUniqueRefreshToken()
        {
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var tokenExists = _context.Users.Any(u => u.RefreshTokens.Any(t => t.Token == token));
            if (tokenExists)
            {
                return CreateUniqueRefreshToken();
            }
            return token;
        }


        public JWTService(IOptions<AppSettings> options, DataContext context)
        {
            _options = options.Value;
            _context = context;
        }

        public string GenerateToken(User user)
        {
            string configurationKey = _options.TokenKey;
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configurationKey);
            var claims = GetClaims(user);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Issuer = "http://localhost:3000",
                IssuedAt = DateTime.Now,
                Expires = DateTime.Now.AddMinutes(2),

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<Response> RefreshAccessToken(string refreshToken)
        {
            try
            {
                if (!refreshToken.IsNullOrEmpty())
                {
                    var dbRefreshToken = await _context.RefreshTokens
                        .SingleOrDefaultAsync(t => t.Token == refreshToken);
                    if (dbRefreshToken is not null)
                    {
                        var dbUserByRefreshToken = await _context.Users.FindAsync(dbRefreshToken.UserId);
                        if (dbUserByRefreshToken is not null)
                        {
                            var dbUserByRefreshTokenAsDto = new UserDto(dbUserByRefreshToken.Id, dbUserByRefreshToken.Username);
                            var userHelper = new UserHelper(_context);
                            var dbUserRoles = await userHelper.GetUserRolesAsync(dbUserByRefreshTokenAsDto);

                            if (!dbRefreshToken.IsExpired)
                            {
                                var accessToken = GenerateToken(dbUserByRefreshToken);
                                if (!accessToken.IsNullOrEmpty())
                                {
                                    var responseUser = new SignedUserDto(dbUserByRefreshToken.Id, dbUserByRefreshToken.Username, accessToken, refreshToken, dbUserRoles);
                                    return new Response(responseUser, StatusCodes.Status200OK, JWTServiceLogTypes.CREATED_ACCESS_TOKEN.ToString());
                                }
                                return new Response(new string(""), StatusCodes.Status204NoContent, JWTServiceLogTypes.EMPTY_OR_NULL.ToString());
                            }

                            var allRefreshTokensByUser = _context.RefreshTokens
                            .Where(u => u.UserId == dbUserByRefreshToken.Id)
                            .ToList();

                            _context.RefreshTokens.RemoveRange(allRefreshTokensByUser);
                            await _context.SaveChangesAsync();
                            return new Response(new Response(), StatusCodes.Status401Unauthorized, JWTServiceLogTypes.EXPIRED_REFRESH_TOKEN.ToString());
                        }
                        return new Response(new Response(), StatusCodes.Status404NotFound, JWTServiceLogTypes.NOT_FOUND.ToString());
                    }
                    return new Response(new Response(), StatusCodes.Status404NotFound, JWTServiceLogTypes.NOT_FOUND.ToString());
                }
                return new Response(new Response(), StatusCodes.Status404NotFound, JWTServiceLogTypes.NOT_FOUND.ToString());

            }
            catch (Exception e)
            {
                return new Response(e.Data, StatusCodes.Status500InternalServerError, JWTServiceLogTypes.ERROR.ToString());
            }

        }

        public RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = CreateUniqueRefreshToken(),
                CreatedAt = DateTime.UtcNow.AddHours(1),
                ExpiresAt = DateTime.UtcNow.AddHours(1).AddMinutes(_options.RefreshTokenTTL),

            };
            return refreshToken;
        }

        public void RemoveInactiveAndExpiredTokens(User user)
        {
            var inactiveAndExpiredTokens = _context.RefreshTokens
                .Where(rt =>
                user.Id == rt.UserId &&
                DateTime.UtcNow.AddHours(1) >= rt.ExpiresAt);

            _context.RemoveRange(inactiveAndExpiredTokens);
        }


        public List<Claim> GetClaims(User user)
        {
            var roles = GetRoles(user);

            var claims = new List<Claim>
            {
                new Claim("Id", user.Id.ToString()),
                new Claim("Username", user.Username),
            };

            if (roles != null)
            {
                foreach (var role in roles)
                {
                    if (role != null)
                    {
                        claims.Add(new Claim(ClaimTypes.Role, role.Name));
                        claims.Add(new Claim("RoleId", role.Id.ToString()));
                    }
                }
            }

            return claims;
        }

        public List<Role> GetRoles(User user)
        {
            if (user != null)
            {
                var userRoleIds = _context.UserRoles.Where(ur => ur.UserId == user.Id)
                    .Select(r => r.RoleId)
                    .ToList();

                var roles = new List<Role>();
                foreach (var roleId in userRoleIds)
                {
                    var dbRole = _context.Roles.Find(roleId);
                    if (dbRole != null) roles.Add(dbRole);
                }
                return roles;
            }
            return new List<Role>();
        }
    }
}
