using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlogAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new { Id = 1, Username = "test_01", PasswordSalt="!223", PasswordHash = "TT1", },
                new { Id = 2, Username = "test_02", PasswordSalt = "!223", PasswordHash = "TT2" },
                new { Id = 3, Username = "test_03", PasswordSalt = "!223", PasswordHash = "TT3" },
                new { Id = 4, Username = "test_04", PasswordSalt = "!223", PasswordHash = "TT4" }
                );

            modelBuilder.Entity<Post>().HasData(
                new { Id = 1, Title = "Title_01" , Content = "Content_T01" , UserId = 1},
                new { Id = 2, Title = "Title_02" , Content = "Content_T02" , UserId = 1},
                new { Id = 3, Title = "Title_03" , Content = "Content_T03" , UserId = 2},
                new { Id = 4, Title = "Title_04" , Content = "Content_T04" , UserId = 2},
                new { Id = 5, Title = "Title_05" , Content = "Content_T05" , UserId = 1}
                );
        }
    }
}
