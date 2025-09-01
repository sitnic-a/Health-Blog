using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Utils.Handlers;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace MentalHealthBlogAPI.Data
{
    public class DataContext : DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _adminPass;
        public DataContext(DbContextOptions<DataContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
            _adminPass = _configuration.GetValue<string>("ADMINPASS");
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PostTag> PostsTags { get; set; }
        public DbSet<Share> Shares { get; set; }
        public DbSet<MentalHealthExpert> MentalHealthExperts { get; set; }
        public DbSet<Emotion> Emotions { get; set; }
        public DbSet<PostEmotion> PostsEmotions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<RegularUser> RegularUsers { get; set; }
        public DbSet<TherapyRequest> TherapyRequests { get; set; }

        public void SeedRegularUsers()
        {
            if (Users.Any() && !RegularUsers.Any())
            {
                const int __USER_ROLE_ID__ = 2;
                var userIds = UserRoles
                    .Where(ur => ur.RoleId == __USER_ROLE_ID__)
                    .Select(ur => ur.UserId)
                    .ToList();

                foreach (var userId in userIds)
                {
                    RegularUsers.Add(new RegularUser(userId, "N/A", "N/A", "N/A"));
                }
                SaveChanges();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            if (string.IsNullOrEmpty(_adminPass))
                throw new InvalidOperationException("JWTKEY not found in configuration.");

            //Predefined emotions loaded on making database
            ExcelHandler excelHandler = new ExcelHandler();
            List<Emotion> emotions = excelHandler.CallGetAllEmotionsFromEmotionWheelFile();

            modelBuilder.Entity<Role>().HasData(
                    new { Id = 1, Name = "Administrator" },
                    new { Id = 2, Name = "User" },
                    new { Id = 3, Name = "Parent" },
                    new { Id = 4, Name = "Psychologist / Psychotherapist" }
                    );

            modelBuilder.Entity<Tag>().HasData(
                new { Id = 1, Name = "Ljubav" },
                new { Id = 2, Name = "Porodica" },
                new { Id = 3, Name = "Posao" },
                new { Id = 4, Name = "Zdravlje" },
                new { Id = 5, Name = "Prijatelji" },
                new { Id = 6, Name = "Karijera" },
                new { Id = 7, Name = "Novac" }
                );

            const int __KEYSIZE__ = 128;
            const int __ITERATIONS = 350000;
            HashAlgorithmName __HASHALGORITHM__ = HashAlgorithmName.SHA512;

            var config = new ConfigurationBuilder()
                            .AddUserSecrets<Program>()
                            .Build();


            var salt = RandomNumberGenerator.GetBytes(__KEYSIZE__);
            var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(_adminPass), salt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
            string passwordHash = Convert.ToHexString(hash).ToLower();

            var adminUser = new User(1, "admin",salt, passwordHash);
            var adminRole = new UserRole(1, 1);

            modelBuilder.Entity<User>().HasData(adminUser);
            modelBuilder.Entity<UserRole>().HasData(adminRole);
            modelBuilder.Entity<Emotion>().HasData(emotions);

            modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
            modelBuilder.Entity<PostTag>().HasKey(pt => new
            {
                pt.PostId,
                pt.TagId
            });
            modelBuilder.Entity<PostEmotion>().HasKey(pe => new
            {
                pe.PostId,
                pe.EmotionId
            });

            modelBuilder.Entity<RegularUser>().HasKey(u => u.UserId);
            modelBuilder.Entity<TherapyRequest>().HasKey(tr =>
            new
            {
                tr.RegularUserId,
                tr.MentalHealthExpertId
            });
        }
    }
}
