using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.API.Services
{
    enum EmotionServiceLogTypes
    {
        EMPTY_OR_NULL_TABLE,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }
    public class EmotionService : IEmotionService
    {
        private readonly DataContext _context;
        private readonly ILogger<IEmotionService> _emotionLoggerService;

        public EmotionService(DataContext context, ILogger<IEmotionService> emotionLoggerService)
        {
            _context = context;
            _emotionLoggerService = emotionLoggerService;
        }
        public async Task<Response> Get()
        {
            try
            {
                var dbEmotions = await _context.Emotions.ToListAsync();
                if (dbEmotions.Any())
                {
                    _emotionLoggerService.LogInformation($"GET: {EmotionServiceLogTypes.SUCCESS.ToString()}", dbEmotions);
                    return new Response(dbEmotions, StatusCodes.Status200OK, EmotionServiceLogTypes.SUCCESS.ToString());
                }
                _emotionLoggerService.LogWarning($"GET: {EmotionServiceLogTypes.EMPTY_OR_NULL_TABLE.ToString()}", dbEmotions);
                throw new EmptyListException("Emotions not found");
            }
            catch (Exception e)
            {
                _emotionLoggerService.LogError($"GET: {EmotionServiceLogTypes.ERROR.ToString()}", e);
                throw;
            }
        }
    }
}
