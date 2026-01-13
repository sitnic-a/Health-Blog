using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace MentalHealthBlog.API.Services.Therapy
{
    enum TherapyInviteLogTypes
    {
        INVALID_DATA,
        SUCCESS,
        NOT_FOUND,
        EMPTY,
        NOTIFIED,
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

        public async Task<Response> GetRegularUserUnnotifiedAutomaticConnectionTherapyInvites(int regularUserId)
        {
            try
            {
                if (regularUserId <= 0)
                {
                    _therapyInviteLoggerService.LogWarning($"REGULAR-USER-UNNOTIFIED-AUTOMATIC-CONNECTION: {TherapyInviteLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var automaticConnectionInvitesRegularUserIsNotNotifiedAbout = new List<TherapyInviteDto>();

                List<TherapyInvite> dbTherapyInvites = await _context.TherapyInvites
                    .Where(ti => ti.RegularUserId == regularUserId && 
                                 ti.IsRegularUserNotifiedAboutAutomaticConnection == false)
                    .ToListAsync();

                foreach (var automaticConnection in dbTherapyInvites)
                {
                    var dbMentalHealthExpert = await _context.MentalHealthExperts
                        .FirstOrDefaultAsync(mhe => mhe.UserId == automaticConnection.MentalHealthExpertId);

                    if (dbMentalHealthExpert == null)
                    {
                        _therapyInviteLoggerService.LogWarning($"REGULAR-USER-UNNOTIFIED-AUTOMATIC-CONNECTION: {TherapyInviteLogTypes.NOT_FOUND.ToString()}");
                        throw new RecordNotFoundException("Mental health expert not found!");
                    }

                    automaticConnectionInvitesRegularUserIsNotNotifiedAbout.Add(new TherapyInviteDto
                    {
                        Id = automaticConnection.Id,
                        IsRegularUserNotifiedAboutAutomaticConnection = automaticConnection.IsRegularUserNotifiedAboutAutomaticConnection,
                        MentalHealthExpertFirstName = dbMentalHealthExpert.FirstName,
                        MentalHealthExpertLastName = dbMentalHealthExpert.LastName,
                        MentalHealthExpertId = automaticConnection.MentalHealthExpertId,
                    });
                }

                if (!automaticConnectionInvitesRegularUserIsNotNotifiedAbout.Any() && dbTherapyInvites.Any())
                {
                    _therapyInviteLoggerService.LogWarning($"REGULAR-USER-UNNOTIFIED-AUTOMATIC-CONNECTION: {TherapyInviteLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Therapy invites not fetched properly!");
                }

                if (!automaticConnectionInvitesRegularUserIsNotNotifiedAbout.Any() && !dbTherapyInvites.Any())
                {
                    _therapyInviteLoggerService.LogWarning($"REGULAR-USER-UNNOTIFIED-AUTOMATIC-CONNECTION: {TherapyInviteLogTypes.EMPTY.ToString()}");
                    return new Response(new List<TherapyInviteDto>(), StatusCodes.Status200OK, TherapyInviteLogTypes.EMPTY.ToString());
                }

                _therapyInviteLoggerService.LogInformation($"REGULAR-USER-UNNOTIFIED-AUTOMATIC-CONNECTION: {TherapyInviteLogTypes.SUCCESS.ToString()}");
                return new Response(automaticConnectionInvitesRegularUserIsNotNotifiedAbout, StatusCodes.Status200OK, TherapyInviteLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _therapyInviteLoggerService.LogError($"REGULAR-USER-UNNOTIFIED-AUTOMATIC-CONNECTION: {e.Message}");
                throw;
            }
        }

        public async Task<Response> MarkRegularUserAutomaticConnectionAsNotified(int regularUserId)
        {
            try
            {
                List<TherapyInvite> dbTherapyInvites = await _context.TherapyInvites
                    .Where(ti => ti.RegularUserId == regularUserId && 
                                 ti.IsRegularUserNotifiedAboutAutomaticConnection == false)
                    .ToListAsync();

                var regularUserUnnotifiedAutomaticConnections = new List<TherapyInviteDto>();

                if (dbTherapyInvites != null)
                {
                    if (dbTherapyInvites.Any())
                    {
                        foreach (var dbTherapyInvite in dbTherapyInvites)
                        {
                            dbTherapyInvite.IsRegularUserNotifiedAboutAutomaticConnection = true;
                        }

                        await _context.SaveChangesAsync();
                        var regularUserUnnotifiedAutomaticConnectionsResponse = await GetRegularUserUnnotifiedAutomaticConnectionTherapyInvites(regularUserId);
                        regularUserUnnotifiedAutomaticConnections = new List<TherapyInviteDto>();

                        _therapyInviteLoggerService.LogInformation($"NOTIFIED-ABOUT-AUTOMATIC-CONNECTION/[regularUserId]: {TherapyInviteLogTypes.SUCCESS.ToString()}");
                        return new Response(regularUserUnnotifiedAutomaticConnections, StatusCodes.Status200OK, TherapyInviteLogTypes.SUCCESS.ToString());
                    }
                    _therapyInviteLoggerService.LogWarning($"NOTIFIED-ABOUT-AUTOMATIC-CONNECTION/[regularUserId]: {TherapyInviteLogTypes.EMPTY.ToString()}");
                    return new Response(regularUserUnnotifiedAutomaticConnections, StatusCodes.Status200OK, TherapyInviteLogTypes.EMPTY.ToString());
                }

                _therapyInviteLoggerService.LogWarning($"NOTIFIED-ABOUT-AUTOMATIC-CONNECTION/[regularUserId]: {TherapyInviteLogTypes.NOT_FOUND.ToString()}");
                throw new RecordNotFoundException("Data not found!");
            }
            catch (Exception e)
            {
                _therapyInviteLoggerService.LogError($"NOTIFIED-ABOUT-AUTOMATIC-CONNECTION/[regularUserId]: {e.Message}");
                throw;
            }
        }
    }
}
