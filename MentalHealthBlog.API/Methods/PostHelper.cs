using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8602

namespace MentalHealthBlog.API.Methods
{
    public class PostHelper
    {
        private readonly DataContext _context;
        public PostHelper(DataContext context)
        {
            _context = context;
        }

        private async Task<List<string>> ReturnPostTagsAsync(int postId)
        {
            if (_context is not null)
            {
                var postTags = await _context.PostsTags
                    .Include(t => t.Tag)
                    .Where(p => p.PostId == postId)
                    .Select(p => p.Tag.Name)
                    .ToListAsync();

                return postTags;
            }
            return new List<string>();
        }

        public async Task<List<string>> CallReturnPostTagsAsync(int postId)
        {
            return await ReturnPostTagsAsync(postId);
        }

        private async Task<List<EmotionDto>> ReturnPostEmotionsAsync(int postId)
        {
            if (_context is not null)
            {
                var dbPostEmotions = await _context.PostsEmotions
                    .Include(e => e.Emotion)
                    .Where(p => p.PostId == postId)
                    .Select(p => new EmotionDto(p.EmotionId, p.Emotion.Name))
                    .ToListAsync();

                return dbPostEmotions;
            }
            return new List<EmotionDto>();
        }

        public async Task<List<EmotionDto>> CallReturnPostEmotionsAsync(int postId)
        {
            return await ReturnPostEmotionsAsync(postId);
        }
    }
}
