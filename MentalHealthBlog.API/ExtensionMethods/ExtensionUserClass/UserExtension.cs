using MentalHealthBlogAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace MentalHealthBlog.API.ExtensionMethods.ExtensionUserClass
{
    public static class UserExtension
    {
        public static byte[] GenerateSalt(this User user, int keySize)
        {
            return RandomNumberGenerator.GetBytes(keySize);
        }

        public static string HashPassword(this User user, string password, byte[] salt, int iterations, HashAlgorithmName hashAlgorithm, int keySize)
        {
            var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password),salt,iterations,hashAlgorithm,keySize);
            return Convert.ToHexString(hash).ToLower();
        }

        public static bool IsNotValid(this User user, string username, string password)
        {
            return String.IsNullOrEmpty(username) || String.IsNullOrWhiteSpace(username) || 
                   String.IsNullOrEmpty(password) || String.IsNullOrWhiteSpace(password);
        }
    }
}
