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
    }
}
