using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
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
        private readonly IHttpContextAccessor? _httpContextAccessor;
        private readonly ILogger<StatisticsService> _statisticsServiceLogger;
        private readonly IEnumerable<PostTag> _dbPostTags;

        private int _loggedUserId = 0;
        public StatisticsService(DataContext context, IHttpContextAccessor httpContextAccessor, ILogger<StatisticsService> statisticsServiceLogger)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _statisticsServiceLogger = statisticsServiceLogger;

            var loggedUser = _httpContextAccessor?.HttpContext?.User;
            if (loggedUser != null)
            {
                var userClaims = loggedUser?.Claims;
                var userId = userClaims?.FirstOrDefault(c => c?.Type == "Id")?.Value;
                bool canBeParsed = int.TryParse(userId, out _loggedUserId);
            }

            _dbPostTags = _context.PostsTags
                .Include(p => p.Post)
                .Include(t => t.Tag)
                .Where(p => p.Post.UserId == _loggedUserId)
                .ToList();
        }
        public async Task<Response> PrepareForMontlyPieGraph(SearchPostDto query)
        {
            try
            {

                if (await _context.PostsTags.AnyAsync())
                {
                    IEnumerable<IGrouping<int, PostTag>> groupedTagsByTagId = _dbPostTags
                            .GroupBy(t => t.TagId);

                    if (query.MonthOfPostCreation.HasValue && query.MonthOfPostCreation > 0)
                    {
                        groupedTagsByTagId = _dbPostTags
                             .Where(pt => pt.Post?.CreatedAt.Month == query.MonthOfPostCreation)
                             .GroupBy(t => t.TagId);
                    }

                    var tagsById = new List<StatisticsPostTagDto>();

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
                _statisticsServiceLogger.LogError($"GET: {StatisticsServiceLogTypes.FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, e.Message);
            }
        }
    }
}
