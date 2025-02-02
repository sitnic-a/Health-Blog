using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Methods
{
    public class ShareHelper
    {
        private readonly DataContext _context;
        public ShareHelper(DataContext context)
        {
            _context = context;
        }
        private async Task<List<Share>> SaveNewShares(DataContext context, ShareContentDto contentToBeShared)
        {
            var sharedContent = new List<Share>();
            var shareGuid = Guid.NewGuid();

            if (contentToBeShared != null)
            {
                if (contentToBeShared.PostIds.Any() && contentToBeShared.SharedWithIds.Any())
                {
                    foreach (var post in contentToBeShared.PostIds)
                    {
                        foreach (var shareWith in contentToBeShared.SharedWithIds)
                        {
                            var newShare = new Share
                            {
                                ShareGuid = shareGuid.ToString(),
                                SharedPostId = post,
                                SharedWithId = shareWith,
                                SharedAt = contentToBeShared.SharedAt.Value.AddHours(1)
                            };

                            sharedContent.Add(newShare);
                            await context.Shares.AddAsync(newShare);
                        }
                    }
                    await context.SaveChangesAsync();
                    return sharedContent;
                }
                if (contentToBeShared.PostIds.Any() && !contentToBeShared.SharedWithIds.Any())
                {
                    foreach (var post in contentToBeShared.PostIds)
                    {
                        var newShare = new Share
                        {
                            ShareGuid = shareGuid.ToString(),
                            SharedPostId = post,
                            SharedWithId = null,
                            SharedAt = contentToBeShared.SharedAt.Value.AddHours(1)
                        };

                        sharedContent.Add(newShare);
                        await context.Shares.AddAsync(newShare);
                    }
                    await context.SaveChangesAsync();
                    return sharedContent;
                }
            }
            return new List<Share>();
        }
        public async Task<List<Share>> CallSaveNewShares(DataContext context, ShareContentDto contentToBeShared)
        {
            return await SaveNewShares(context, contentToBeShared);
        }

        private List<PostDto> FillSharedContent(IGrouping<User, Share> userAndContent, List<PostDto> content)
        {
            PostHelper convertHelper = new PostHelper(_context);

            foreach (var sharedPost in userAndContent)
            {
                var post = sharedPost?.SharedPost;
                if (post is not null)
                {
                    var postTags = convertHelper.CallReturnPostTags(post.Id);
                    var postDto = new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, postTags);
                    postDto.SharedAt = sharedPost?.SharedAt;
                    content.Add(postDto);
                }
            }
            return content;
        }

        public List<PostDto> CallFillSharedContent(IGrouping<User, Share> userAndContent, List<PostDto> content)
        {
            return FillSharedContent(userAndContent, content);
        }
    }
}
