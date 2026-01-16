using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlog.API.Methods
{
    public class MentalExpertHelper
    {
        private readonly DataContext _context;
        private readonly ILogger<IMentalExpertService> _mentalExpertLoggerService;
        public MentalExpertHelper(DataContext context, ILogger<IMentalExpertService> mentalExpertLoggerService)
        {
            _context = context;
            _mentalExpertLoggerService = mentalExpertLoggerService;
        }

        private async Task<Response> FilterMentalHealthExpertsBySearchParameters(SearchExpertDto request)
        {
            List<TherapyMentalHealthExpertDto> dbMentalHealthExpertsCombinedWithTherapies = new List<TherapyMentalHealthExpertDto>();
            List<TherapyRequest> dbUsersMentalHealthExperts = new List<TherapyRequest>();

            if (request is not null)
            {
                dbMentalHealthExpertsCombinedWithTherapies = await _context.MentalHealthExperts
                    .Where(mhe => mhe.IsApproved == true)
                    .Select(mhe => new TherapyMentalHealthExpertDto
                    {
                        MentalHealthExpertId = mhe.Id,
                        MentalHealthExpertUserId = mhe.UserId,
                        FirstName = mhe.FirstName,
                        LastName = mhe.LastName,
                        Organization = mhe.Organization,
                        PhoneNumber = mhe.PhoneNumber,
                        Email = mhe.Email,
                        PhotoAsFile = mhe.PhotoAsFile,
                        PhotoAsPath = mhe.PhotoAsPath,
                        RequestStatus = RequestStatusEnum.Undefined,
                        RegularUserId = request.LoggedUserId
                    })
                    .ToListAsync();

                dbUsersMentalHealthExperts = await _context.TherapyRequests
                    .Where(tr => tr.RegularUserId == request.LoggedUserId)
                    .ToListAsync();

                foreach (var mentalHealthExpert in dbMentalHealthExpertsCombinedWithTherapies)
                {
                    var mentalHealthExpertInRequests = dbUsersMentalHealthExperts
                        .SingleOrDefault(mhe => mhe.MentalHealthExpertId == mentalHealthExpert.MentalHealthExpertUserId &&
                                         mhe.RegularUserId == request.LoggedUserId);


                    if (mentalHealthExpertInRequests != null)
                    {
                        mentalHealthExpert.RequestStatus = mentalHealthExpertInRequests.RequestStatus;
                        continue;
                    }
                }

                dbMentalHealthExpertsCombinedWithTherapies = dbMentalHealthExpertsCombinedWithTherapies
                    .Where(mhe => mhe.RequestStatus == RequestStatusEnum.Undefined ||
                           mhe.RequestStatus == RequestStatusEnum.Declined)
                    .DistinctBy(mhe => mhe.MentalHealthExpertUserId)
                    .ToList();

                if (!dbMentalHealthExpertsCombinedWithTherapies.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("No records found in database");
                }

                _mentalExpertLoggerService.LogInformation($"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                return new Response(dbMentalHealthExpertsCombinedWithTherapies, StatusCodes.Status200OK, $"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
            }

            _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.INVALID_DATA.ToString()}");
            throw new ArgumentException("Bad request!");
        }

        public async Task<Response> CallFilterMentalHealthExpertsBySearchParameter(SearchExpertDto request)
        {
            return await FilterMentalHealthExpertsBySearchParameters(request);
        }
    }
}
