using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8629

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
            try
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
                                var mentalHealthExpert = await _context.MentalHealthExperts
                                    .SingleOrDefaultAsync(mhe => mhe.UserId == shareWith);

                                if (mentalHealthExpert == null)
                                {
                                    throw new RecordNotFoundException("Mental health expert not found!");
                                }

                                var newShare = new Share
                                {
                                    ShareGuid = shareGuid.ToString(),
                                    SharedPostId = post,
                                    SharedWithId = mentalHealthExpert.Id,
                                    SharedAt = contentToBeShared.SharedAt.Value.AddHours(1)
                                };

                                if (newShare == null)
                                {
                                    throw new CreateRecordException("Post can't be shared!");
                                }
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
                                SharedWith = null,
                                SharedAt = contentToBeShared.SharedAt.Value.AddHours(1)
                            };

                            if (newShare == null)
                            {
                                throw new CreateRecordException("Post can't be shared!");
                            }

                            sharedContent.Add(newShare);
                            await context.Shares.AddAsync(newShare);
                        }
                        await context.SaveChangesAsync();
                        return sharedContent;
                    }
                }
                throw new ArgumentException("Bad request!");
            }
            catch (Exception)
            {
                throw;
            }
            
        }
        public async Task<List<Share>> CallSaveNewShares(DataContext context, ShareContentDto contentToBeShared)
        {
            return await SaveNewShares(context, contentToBeShared);
        }

        private async Task<List<PostDto>> FillSharedContentAsync(IGrouping<MentalHealthExpert, Share> userAndContent, List<PostDto> content)
        {
            PostHelper convertHelper = new PostHelper(_context);

            foreach (var sharedPost in userAndContent)
            {
                var post = sharedPost?.SharedPost;
                if (post is not null)
                {
                    var postTags = await convertHelper.CallReturnPostTagsAsync(post.Id);
                    var postEmotions = await convertHelper.CallReturnPostEmotionsAsync(post.Id);
                    var postDto = new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, postTags,postEmotions);
                    postDto.Emotions = postEmotions;
                    postDto.SharedAt = sharedPost?.SharedAt;
                    content.Add(postDto);
                }
            }
            return content;
        }

        private async Task<List<PostDto>> FillByUsersSharedContentForMentalHealthExpertPreviewAsync(IGrouping<User, Share> userAndContent, List<PostDto> content)
        {
            PostHelper convertHelper = new PostHelper(_context);

            foreach (var sharedPost in userAndContent)
            {
                var post = sharedPost?.SharedPost;
                if (post is not null)
                {
                    var postTags = await convertHelper.CallReturnPostTagsAsync(post.Id);
                    var postEmotions = await convertHelper.CallReturnPostEmotionsAsync(post.Id);
                    var postDto = new PostDto(post.Id, post.Title, post.Content, post.UserId, post.CreatedAt, postTags,postEmotions);
                    postDto.SharedAt = sharedPost?.SharedAt;
                    content.Add(postDto);
                }
            }
            return content;
        }

        public async Task<List<PostDto>> CallFillSharedContentAsync(IGrouping<MentalHealthExpert, Share> userAndContent, List<PostDto> content)
        {
            return await FillSharedContentAsync(userAndContent, content);
        }

        public async Task<List<PostDto>> CallFillByUsersSharedContentForMentalHealthExpertPreviewAsync(IGrouping<User, Share> userAndContent, List<PostDto> content)
        {
            return await FillByUsersSharedContentForMentalHealthExpertPreviewAsync(userAndContent, content);
        }
    }
}
