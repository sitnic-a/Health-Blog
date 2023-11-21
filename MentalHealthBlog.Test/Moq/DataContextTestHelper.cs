using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.Test.Moq
{
    public static class DataContextTestHelper
    {
        public static DataContext LoadDataContext()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "dataContextTest")
                .Options;

            var context = new DataContext(options);
            context.Database.EnsureDeleted();
            context.SaveChanges();

            // Insert seed data into the database using one instance of the context
            context.Users.Add(new User { Id = 1, Username = "test_01", PasswordSalt = new byte[128], PasswordHash = "PH1" });
            context.Users.Add(new User { Id = 2, Username = "test_02", PasswordSalt = new byte[128], PasswordHash = "PH2" });
            context.Users.Add(new User { Id = 3, Username = "test_03", PasswordSalt = new byte[128], PasswordHash = "PH3" });

            context.Posts.Add(new Post { Id = 1, Title = "Title_01_Mocked_01", Content = "Content_01", UserId = 1 });
            context.Posts.Add(new Post { Id = 2, Title = "Title_02", Content = "Content_02", UserId = 1 });
            context.Posts.Add(new Post { Id = 3, Title = "Title_03", Content = "Content_03", UserId = 2 });
            context.Posts.Add(new Post { Id = 4, Title = "Title_04", Content = "Content_04", UserId = 1 });
            context.Posts.Add(new Post { Id = 5, Title = "Title_05_Mocked_05", Content = "Content_05", UserId = 2 });

            context.SaveChangesAsync();
            return context;
        }

    }
}
