using MentalHealthBlog.API.Models;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;

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
            context.Users.Add(new User { Id = 1, Username = "test_01", PasswordSalt = Encoding.UTF8.GetBytes("test_01"), PasswordHash = "a961c3258198805cd93901a25b3603e8adb58b664a22c0538948adc416169e7d00ce002602a68f6e4ff785ce308e49782663eab6303b733a72b1cddafb31090cc3f2a1aaf0e91fd09df50a044f5543f77c73e3e0997ed6a566bb506a5beac899a9d03972217b80e686aa3dcb9f47cfa2b81af1181411ed0fbe346f594512287a" });
            context.Users.Add(new User { Id = 2, Username = "test_02", PasswordSalt = new byte[128], PasswordHash = "PH2" });
            context.Users.Add(new User { Id = 3, Username = "test_03", PasswordSalt = Encoding.UTF8.GetBytes("test_03"), PasswordHash = "e4957135df6b6df03bb172176d1161fb2cd892c498d0664a5b71f0aea665ec1e7b1b427ecffde4ebe2de497eec9387defeab2b729f542a3bbc7351f69ea01e09a49c4eff0ea02d79f335fbff6193011e3ea9e1c55c54481a432db3c2d258ef78fef50f1c97026c97414bb865db6e2f5eddc6f75c8ecc1974b6d12c2b335582a1" });

            context.Posts.Add(new Post { Id = 1, Title = "Title_01_Mocked_01_xUnit01", Content = "Content_01", UserId = 1 });
            context.Posts.Add(new Post { Id = 2, Title = "Title_02_Mocked_02_xUnit02", Content = "Content_02", UserId = 1 });
            context.Posts.Add(new Post { Id = 3, Title = "Title_03_Mocked_03_xUnit03", Content = "Content_03", UserId = 2 });
            context.Posts.Add(new Post { Id = 4, Title = "Title_04_Mocked_04_xUnit04", Content = "Content_04", UserId = 1 });
            context.Posts.Add(new Post { Id = 5, Title = "Title_05_Mocked_05_xUnit05", Content = "Content_05", UserId = 2 });

            context.Tags.Add(new Tag { Id = 1, Name = "Ljubav" });
            context.Tags.Add(new Tag { Id = 2, Name = "Tuga" });
            context.Tags.Add(new Tag { Id = 3, Name = "Radost" });
            context.Tags.Add(new Tag { Id = 4, Name = "Posao" });
            context.Tags.Add(new Tag { Id = 5, Name = "Karijera" });
            context.Tags.Add(new Tag { Id = 6, Name = "Prijatelji" });

            context.PostsTags.Add(new PostTag { PostId = 1, TagId = 2 });
            context.PostsTags.Add(new PostTag { PostId = 1, TagId = 4 });
            context.PostsTags.Add(new PostTag { PostId = 1, TagId = 5 });
            context.PostsTags.Add(new PostTag { PostId = 2, TagId = 2 });
            context.PostsTags.Add(new PostTag { PostId = 2, TagId = 3 });
            context.PostsTags.Add(new PostTag { PostId = 2, TagId = 4 });
            context.PostsTags.Add(new PostTag { PostId = 2, TagId = 5 });
            context.PostsTags.Add(new PostTag { PostId = 2, TagId = 6 });

            context.SaveChangesAsync();
            return context;
        }

    }
}
