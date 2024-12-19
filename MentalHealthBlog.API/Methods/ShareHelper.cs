using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlogAPI.Data;

namespace MentalHealthBlog.API.Methods
{
    public class ShareHelper
    {
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
    }
}
