using MentalHealthBlog.API.Models;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MentalHealthBlog.API.Utils
{
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
