using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Utils.Handlers;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MentalHealthBlogAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Predefined emotions loaded on making database
            ExcelHandler excelHandler = new ExcelHandler();
            List<Emotion> emotions = excelHandler.CallGetAllEmotionsFromEmotionWheelFile();

            modelBuilder.Entity<Emotion>().HasData(emotions);

            modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<PostTag>().HasKey(pt => new
            {
                pt.PostId,
                pt.TagId
            });

            modelBuilder.Entity<User>().HasData(
                new { Id = 1, Username = "test_01", PasswordHash = "TT1", PasswordSalt = Encoding.UTF8.GetBytes("SetBytes_TT1") },
                new { Id = 2, Username = "test_02", PasswordHash = "TT2", PasswordSalt = Encoding.UTF8.GetBytes("SetBytes_TT2") },
                new { Id = 3, Username = "test_03", PasswordHash = "TT3", PasswordSalt = Encoding.UTF8.GetBytes("SetBytes_TT3") },
                new { Id = 4, Username = "test_04", PasswordHash = "TT4", PasswordSalt = Encoding.UTF8.GetBytes("SetBytes_TT4") }
                );

            modelBuilder.Entity<Role>().HasData(
                new { Id = 1, Name = "Administrator" },
                new { Id = 2, Name = "User" },
                new { Id = 3, Name = "Parent" },
                new { Id = 4, Name = "Psychologist / Psychotherapist" }
                );

            modelBuilder.Entity<Post>().HasData(
                new { Id = 1, Title = "Title_01", Content = "Content_T01", UserId = 1, CreatedAt = DateTime.Now },
                new { Id = 2, Title = "Title_02", Content = "Content_T02", UserId = 1, CreatedAt = DateTime.Now },
                new { Id = 3, Title = "Title_03", Content = "Content_T03", UserId = 2, CreatedAt = DateTime.Now },
                new { Id = 4, Title = "Title_04", Content = "Content_T04", UserId = 2, CreatedAt = DateTime.Now },
                new { Id = 5, Title = "Title_05", Content = "Content_T05", UserId = 1, CreatedAt = DateTime.Now }
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
        }


    }
}
