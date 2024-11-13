using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

#pragma warning disable CS8620

namespace MentalHealthBlog.API.Services
{
    public class MentalExpertService : IMentalExpertService
    {
        private readonly DataContext _context;
        private readonly ILogger<IMentalExpertService> _mentalExpertLoggerService;

        public MentalExpertService(DataContext context, ILogger<IMentalExpertService> mentalExpertLoggerService)
        {
            _context = context;
            _mentalExpertLoggerService = mentalExpertLoggerService;
        }
        public async Task<List<SharesPerUserDto>> GetSharesPerUser()
        {

            var dbShares = await _context.Shares
                .Include(p => p.SharedPost)
                .Include(u => u.SharedPost.User)
                .ToListAsync();

            if (!dbShares.IsNullOrEmpty())
            {
                var groupedUsersAndTheirShares = dbShares
                    .Distinct()
                    //.Where(ex => ex.SharedWithId == 7) //filter for specific doctor, logged doctor, for now hard-coded
                    .GroupBy(u => u.SharedPost.User);

                List<SharesPerUserDto> sharesPerUser = new List<SharesPerUserDto>();
                PostHelper convertHelper = new PostHelper(_context);

                foreach (var userFromGroup in groupedUsersAndTheirShares)
                {
                    var dbUserByKey = await _context.Users.FindAsync(userFromGroup.Key.Id);
                    UserDto userThatSharedContent;
                    List<PostDto> contentUserShared = new List<PostDto>();

                    if (dbUserByKey is not null)
                    {
                        userThatSharedContent = new UserDto(dbUserByKey.Id, dbUserByKey.Username);
                        foreach (var sharedContent in userFromGroup)
                        {
                            var post = sharedContent?.SharedPost;
                            if (post is not null)
                            {
                                var postTags = convertHelper.CallReturnPostTags(post.Id);
                                var postDto = new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, postTags);
                                contentUserShared.Add(postDto);
                            }
                        }
                        sharesPerUser.Add(new SharesPerUserDto(userThatSharedContent, contentUserShared));
                    }
                }
                if (!sharesPerUser.IsNullOrEmpty()) return sharesPerUser;

                return new List<SharesPerUserDto>();
            }
            return new List<SharesPerUserDto>();
        }
    }
}

