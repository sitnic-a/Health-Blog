using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8602,CS8604

namespace MentalHealthBlog.API.Services.Therapy
{
    public enum TherapyRequestLogTypes
    {
        ARGUMENT_NOT_VALID,
        EMPTY,
        NOT_FOUND,
        SUCCESS
    }
    public class TherapyRequestService : ITherapyRequestService
    {
        private readonly DataContext _context;
        private readonly ILogger<ITherapyRequestService> _therapyRequestLoggerService;

        public TherapyRequestService(DataContext context, ILogger<ITherapyRequestService> therapyRequestLoggerService)
        {
            _context = context;
            _therapyRequestLoggerService = therapyRequestLoggerService;
        }

        public async Task<Response> GetRequestsForMentalHealthExpert(SearchTherapyRequestDto? query = null)
        {
            try
            {
                List<Models.ResourceResponse.TherapyRequestDto> dbTherapyRequests = new List<Models.ResourceResponse.TherapyRequestDto>();

                if (query is not null)
                {
                    if (query?.LoggedUserId <= 0)
                    {
                        _therapyRequestLoggerService.LogWarning($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
                        throw new ArgumentException("Bad request!");
                    }

                    dbTherapyRequests = await _context.TherapyRequests
                     .Where(tr => tr.MentalHealthExpertId == query.LoggedUserId)
                     .Join((_context.RegularUsers),
                           (therapyRequest) => therapyRequest.RegularUserId,
                           (regularUser) => regularUser.UserId,
                           (tr, ru) => new Models.ResourceResponse.TherapyRequestDto
                           {
                               RegularUserId = ru.UserId,
                               RegularUserFirstName = ru.FirstName,
                               RegularUserLastName = ru.LastName,
                               MentalHealthExpertId = tr.MentalHealthExpertId,
                               RequestStatus = tr.RequestStatus,
                               SentAt = tr.SentAt,
                           })
                     .ToListAsync();


                    if (dbTherapyRequests is not null)
                    {
                        if (!dbTherapyRequests.Any())
                        {
                            _therapyRequestLoggerService.LogWarning($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.EMPTY.ToString()}");
                            return new Response(dbTherapyRequests, StatusCodes.Status200OK, $"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.EMPTY.ToString()}");
                        }
                    }

                    _therapyRequestLoggerService.LogInformation($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                    return new Response(dbTherapyRequests, StatusCodes.Status200OK, $"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                }

                _therapyRequestLoggerService.LogWarning($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
                throw new ArgumentException("Bad request!");

            }
            catch (Exception e)
            {
                _therapyRequestLoggerService.LogError($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {e.Message}");
                throw;
            }
        }
        public async Task<Response> GetUsersMentalHealthExperts(SearchTherapyRequestDto? query = null)
        {
            try
            {
                if (query is not null)
                {
                    if (query.LoggedUserId <= 0)
                    {
                        _therapyRequestLoggerService.LogWarning($"MY-EXPERTS: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
                        throw new ArgumentException("Bad request!");
                    }

                    //Dodati provjere za filtere sa frontenda:
                        // za sve experte
                        // za trenutno aktivne experte
                        // za experte koji su nekada imali pristup sadrzaju

                    var dbMentalHealthExperts = await _context.TherapyRequests
                        .Where(u => u.RegularUserId == query.LoggedUserId)
                        .Join(_context.MentalHealthExperts,

                              (tr) => tr.MentalHealthExpertId,
                              (mhe) => mhe.UserId,
                              (tr, mhe) => new
                              {
                                  MentalHealthExpertId = tr.MentalHealthExpertId,
                                  RegularUserId = tr.RegularUserId,
                                  MentalHealthExpertUsername = _context.Users.SingleOrDefault(u => u.Id == mhe.UserId).Username,
                                  MentalHealthExpertFirstName = mhe.FirstName,
                                  MentalHealthExpertLastName = mhe.LastName,
                                  MentalHealthExpertOrganization = mhe.Organization,
                                  MentalHealthExpertEmail = mhe.Email,
                                  MentalHealthExpertPhoneNumber = mhe.PhoneNumber,
                                  MentalHealthExpertPhotoAsPath = mhe.PhotoAsPath,
                                  MentalHealthExpertPhotoAsFile = mhe.PhotoAsFile,
                                  RequestStatus = tr.RequestStatus,
                              })
                        .ToListAsync();

                    if (dbMentalHealthExperts is not null)
                    {
                        if (dbMentalHealthExperts.Any())
                        {
                            _therapyRequestLoggerService.LogInformation($"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}", dbMentalHealthExperts);
                            return new Response(dbMentalHealthExperts, StatusCodes.Status200OK, $"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                        }

                        _therapyRequestLoggerService.LogInformation($"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}", dbMentalHealthExperts);
                        return new Response(dbMentalHealthExperts, StatusCodes.Status200OK, $"MY-EXPERTS: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                    }

                    _therapyRequestLoggerService.LogWarning($"MY-EXPERTS: {TherapyRequestLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Couldn't return data!");
                }

                _therapyRequestLoggerService.LogWarning($"MY-EXPERTS: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}", query);
                throw new ArgumentException("Bad request!");
            }
            catch (Exception e)
            {
                _therapyRequestLoggerService.LogError($"MY-EXPERTS: {e.Message}");
                throw;
            }
        }
        public async Task<Response> ChangeRequestStatus(Models.ResourceRequest.TherapyRequestDto request)
        {
            try
            {
                if (request is null)
                {
                    _therapyRequestLoggerService.LogWarning($"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                if (request != null)
                {
                    if (request.MentalHealthExpertId <= 0 || request.RegularUserId <= 0)
                    {
                        _therapyRequestLoggerService.LogWarning($"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
                        throw new ArgumentException("Bad request!");
                    }
                }

                var requestToModify = await _context.TherapyRequests
                    .SingleOrDefaultAsync(tr => tr.MentalHealthExpertId == request.MentalHealthExpertId &&
                                         tr.RegularUserId == request.RegularUserId);

                if (requestToModify is null)
                {
                    _therapyRequestLoggerService.LogWarning($"CHANGE-REQUEST-STATUS : {TherapyRequestLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Request couldn't be located!");
                }

                requestToModify.RequestStatus = (RequestStatusEnum)request.NewRequestStatus;
                await _context.SaveChangesAsync();

                var query = new SearchTherapyRequestDto(request.MentalHealthExpertId, null);
                var requests = await GetRequestsForMentalHealthExpert(query);
                _therapyRequestLoggerService.LogInformation($"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.SUCCESS.ToString()}", requestToModify);
                return new Response(requests.ServiceResponseObject, StatusCodes.Status200OK, $"CHANGE-REQUEST-STATUS: {TherapyRequestLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _therapyRequestLoggerService.LogError($"CHANGE-REQUEST-STATUS: {e.Message}");
                throw;
            }

        }

    }
}
