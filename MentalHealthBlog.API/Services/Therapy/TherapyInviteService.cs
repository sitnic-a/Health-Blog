using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.API.Services.Therapy
{
    enum TherapyInviteLogTypes
    {
        INVALID_DATA,
        SUCCESS,
        NOT_FOUND
    }

    public class TherapyInviteService : ITherapyInviteService
    {
        private readonly DataContext _context;
        private readonly ILogger<ITherapyInviteService> _therapyInviteLoggerService;

        public TherapyInviteService(DataContext context, ILogger<ITherapyInviteService> therapyInviteLoggerService)
        {
            _context = context;
            _therapyInviteLoggerService = therapyInviteLoggerService;
        }

        public async Task<Response> CheckIfRegularUserNotifiedAboutTherapyInviteAutomaticConnection(int regularUserId)
        {
            if (regularUserId<=0)
            {
                _therapyInviteLoggerService.LogWarning($"Checking if notified automatic connections available {TherapyInviteLogTypes.INVALID_DATA.ToString()}");
                throw new ArgumentException("Bad request!");
            }

            bool isRegularUserNotifiedAboutAutomaticConnection = await _context.TherapyInvites
                .Where(ti => ti.RegularUserId == regularUserId)
                .AnyAsync(ti => ti.IsRegularUserNotifiedAboutAutomaticConnection == true);

            return new Response(isRegularUserNotifiedAboutAutomaticConnection, StatusCodes.Status200OK, $"Checking if notified automatic connections available {TherapyInviteLogTypes.SUCCESS.ToString()}");
        }
    }
}
