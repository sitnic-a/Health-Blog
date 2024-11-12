using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

#pragma warning disable CS8620

namespace MentalHealthBlog.API.Services
{
    public class MentalExpertService : IMentalExpertService
    {
        private readonly DataContext _context;
        private readonly ILogger<IMentalExpertService> _mentalExpertLoggerService;

        public MentalExpertService(DataContext context, ILogger<IMentalExpertService> mentalExpertLoggerService)
        {
            _context = context;
            _mentalExpertLoggerService = mentalExpertLoggerService;
        }
        public async Task<ExpertSharesDto> GetSharesPerUser()
        {

            var dbShares = _context.Shares
                .Include(p => p.SharedPost)
                .Include(u => u.SharedPost.User);

            if (!dbShares.IsNullOrEmpty() || await dbShares.AnyAsync())
            {
                var sharesPerUser = dbShares
                    .Distinct()
                    .Where(ex => ex.SharedWithId == 7) //filter for specific doctor, logged doctor, for now hard-coded
                    .GroupBy(u => u.SharedPost.User);

                    var sharesForExpertDashboard = new ExpertSharesDto(sharesPerUser);
                    return sharesForExpertDashboard;
            }

            return new ExpertSharesDto();
        }

    }
}
