using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Utils.Handlers;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Configuration;
using System.Diagnostics;
using System.Reflection.Emit;
using System.Security.Cryptography;
using System.Text;

namespace MentalHealthBlogAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
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
        public DbSet<AssignmentResponse> AssignmentResponses { get; set; }
        public DbSet<RegularUser> RegularUsers { get; set; }
        public DbSet<TherapyRequest> TherapyRequests { get; set; }
        public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<TherapyInvite> TherapyInvites { get; set; }

        public void SeedRegularUsers(string adminPass)
        {
            if (!Users.Any())
            {
                const int __KEYSIZE__ = 128;
                const int __ITERATIONS = 350000;
                HashAlgorithmName __HASHALGORITHM__ = HashAlgorithmName.SHA512;


                var salt = RandomNumberGenerator.GetBytes(__KEYSIZE__);
                var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(adminPass), salt, __ITERATIONS, __HASHALGORITHM__, __KEYSIZE__);
                string passwordHash = Convert.ToHexString(hash).ToLower();

                var adminUser = new User(1, "admin", salt, passwordHash);
                var adminRole = new UserRole(1, 1);
                Users.Add(adminUser);
                UserRoles.Add(adminRole);
                SaveChanges();
            }

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

            //Predefined emotions loaded on making database
            ExcelHandler excelHandler = new ExcelHandler();
            List<Emotion> emotions = excelHandler.CallGetAllEmotionsFromEmotionWheelFile();

            modelBuilder.Entity<User>().Property(u => u.IsUsingForTheFirstTime).HasDefaultValue(true);

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

            int trialPeriod = 7;

            modelBuilder.Entity<RegularUser>()
                .HasKey(u => u.UserId);

            DateTime registeredAt = DateTime.UtcNow;
            modelBuilder.Entity<RegularUser>().Property(ru => ru.RegisteredAt).HasDefaultValue(registeredAt);
            modelBuilder.Entity<RegularUser>().Property(ru => ru.FirstLoggedAt).HasDefaultValue(null);
            modelBuilder.Entity<RegularUser>().Property(ru => ru.IsInTrialPeriod).HasDefaultValue(true);
            modelBuilder.Entity<RegularUser>().Property(ru => ru.TrialEndsAt).HasDefaultValue(null);
            modelBuilder.Entity<RegularUser>().Property(ru => ru.HavePaidForSubscription).HasDefaultValue(false);

            modelBuilder.Entity<MentalHealthExpert>().Property(ru => ru.RegisteredAt).HasDefaultValue(registeredAt);
            modelBuilder.Entity<MentalHealthExpert>().Property(ru => ru.ApprovedAt).HasDefaultValue(null);
            modelBuilder.Entity<MentalHealthExpert>().Property(ru => ru.FirstLoggedAt).HasDefaultValue(null);
            modelBuilder.Entity<MentalHealthExpert>().Property(ru => ru.IsInTrialPeriod).HasDefaultValue(true);
            modelBuilder.Entity<MentalHealthExpert>().Property(ru => ru.TrialEndsAt).HasDefaultValue(null);
            modelBuilder.Entity<MentalHealthExpert>().Property(ru => ru.HavePaidForSubscription).HasDefaultValue(false);

            modelBuilder.Entity<TherapyRequest>().HasKey(tr =>
            new
            {
                tr.RegularUserId,
                tr.MentalHealthExpertId
            });

            modelBuilder.Entity<SubscriptionPlan>().HasData(new List<SubscriptionPlan>()
            {
                new (1,"Korisnik(Mjesečna)", "Mjesečna pretplata za običnog korisnika",20.0f),
                new (2,"Korisnik(Godišnja)", "Godišnja pretplata za običnog korisnika", 200.0f),
                new (3,"Stručnjaci(Mjesečna)", "Mjesečna pretplata za stručnjaka na polju mentalnog zdravlja",50.0f),
                new (4,"Stručnjaci(Godišnja)", "Godišnja pretplata za stručnjaka na polju mentalnog zdravlja",500.0f),
                new (5,"Neodređena", "Uplata koju je izvršio korisnik aplikacije, a da nije predefinisana"),
            });
        }
    }
}
