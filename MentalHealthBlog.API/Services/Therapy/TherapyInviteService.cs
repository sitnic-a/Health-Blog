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

        public async Task<Response> CheckIfInformedAboutTherapyInvites(int regularUserId)
        {
            if (regularUserId<=0)
            {
                _therapyInviteLoggerService.LogWarning($"Checking for therapy invites {TherapyInviteLogTypes.INVALID_DATA.ToString()}");
                throw new ArgumentException("Bad request!");
            }

            bool haveUnnotifiedTherapyInvites = false;
            //bool haveUnnotifiedTherapyInvites = await _context.TherapyInvites.AnyAsync(ti => ti.IsNotifiedAboutTherapyInvite);

            return new Response(haveUnnotifiedTherapyInvites, StatusCodes.Status200OK, $"Checking for therapy invites {TherapyInviteLogTypes.SUCCESS.ToString()}");
        }
    }
}
