using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.API.Services
{
    enum StatisticsServiceLogTypes
    {
        NULL,
        SUCCESS,
        FAILED
    }

    public class StatisticsService : IStatisticsService
    {
        private readonly DataContext _context;
        private readonly ILogger<StatisticsService> _statisticsServiceLogger;
        private readonly IEnumerable<PostTag> _dbPostTags;

        public StatisticsService(DataContext context, ILogger<StatisticsService> statisticsServiceLogger)
        {
            _context = context;
            _statisticsServiceLogger = statisticsServiceLogger;
            _dbPostTags = _context.PostsTags
                .Include(t => t.Tag)
                .ToList();
        }
        public async Task<Response> PrepareForMontlyPieGraph()
        {
            try
            {
                if (await _context.PostsTags.AnyAsync())
                {
                    var tagsById = new List<StatisticsPostTagDto>();

                    var groupedTagsByTagId = _dbPostTags
                        .GroupBy(t => t.TagId);

                    foreach (var item in groupedTagsByTagId)
                    {
                        var dbPostTag = _dbPostTags.FirstOrDefault(t => t.TagId == item.Key);
                        if (dbPostTag != null && dbPostTag.Tag != null)
                        {
                            var tagById = new StatisticsPostTagDto
                            {
                                TagId = dbPostTag.TagId,
                                NumberOfTags = item.Count(),
                                Tag = dbPostTag.Tag,
                                TagName = dbPostTag.Tag.Name,
                            };
                            tagsById.Add(tagById);
                        }
                    };

                    var pieGraphData = tagsById.OrderByDescending(t => t.NumberOfTags).Take(5);
                    _statisticsServiceLogger.LogInformation($"GET: {StatisticsServiceLogTypes.SUCCESS}");
                    return new Response(pieGraphData, StatusCodes.Status200OK, StatisticsServiceLogTypes.SUCCESS.ToString());
                }
                _statisticsServiceLogger.LogWarning($"GET: {StatisticsServiceLogTypes.NULL}");
                return new Response(new object(), StatusCodes.Status204NoContent, StatisticsServiceLogTypes.NULL.ToString());
            }
            catch (Exception e)
            {
                _statisticsServiceLogger.LogError($"GET: {StatisticsServiceLogTypes.FAILED.ToString()}",e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, e.Message);
            }
        }
    }
}
