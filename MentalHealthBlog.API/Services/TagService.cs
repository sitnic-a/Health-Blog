using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.API.Services
{
    enum TagServiceLogTypes
    {
        TAG_NULL,
        TAG_EMPTY,
        TAG_INVALID_DATA,
        TAGS_SUCCESS,
        TAGS_FAILED
    }
    public class TagService : ITagService
    {
        private readonly DataContext _context;
        private readonly ILogger<TagService> _tagServiceLogger;

        public TagService(DataContext context, ILogger<TagService> tagServiceLogger)
        {
            _context = context;
            _tagServiceLogger = tagServiceLogger;
        }
        public async Task<Response> GetTags()
        {
            try
            {
                var tags = await _context.Tags.ToListAsync();

                if (!tags.Any())
                {
                    _tagServiceLogger.LogWarning($"GET: {TagServiceLogTypes.TAG_EMPTY.ToString()}");
                    return new Response(new List<Tag>(), StatusCodes.Status200OK, TagServiceLogTypes.TAG_EMPTY.ToString());
                }

                _tagServiceLogger.LogInformation($"GET: {TagServiceLogTypes.TAGS_SUCCESS.ToString()}");
                return new Response(tags, StatusCodes.Status200OK, TagServiceLogTypes.TAGS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _tagServiceLogger.LogError($"GET: {TagServiceLogTypes.TAGS_FAILED.ToString()}", e);
                throw;
            }
        }
    }
}
