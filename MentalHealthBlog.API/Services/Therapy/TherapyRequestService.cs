using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.AspNetCore.Http.HttpResults;
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
                if (query is null)
                {
                    _therapyRequestLoggerService.LogWarning($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                if (query?.LoggedUserId <= 0)
                {
                    _therapyRequestLoggerService.LogWarning($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.ARGUMENT_NOT_VALID.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbTherapyRequests = await _context.TherapyRequests
                    .Where(tr => tr.MentalHealthExpertId == query.LoggedUserId)
                    .Join((_context.RegularUsers),
                          (therapyRequest) => therapyRequest.RegularUserId,
                          (regularUser) => regularUser.UserId,
                          (tr, ru) => new TherapyRequestDto
                          {
                              RegularUserId = ru.UserId,
                              RegularUserFirstName = ru.FirstName,
                              RegularUserLastName = ru.LastName,
                              MentalHealthExpertId = tr.MentalHealthExpertId,
                              RequestStatus = tr.RequestStatus,
                              SentAt = tr.SentAt,
                          })
                    .ToListAsync();

                if (!dbTherapyRequests.Any())
                {
                    _therapyRequestLoggerService.LogWarning($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("Therapy requests not found");
                }

                _therapyRequestLoggerService.LogInformation($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.SUCCESS.ToString()}");
                return new Response(dbTherapyRequests, StatusCodes.Status200OK, $"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {TherapyRequestLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _therapyRequestLoggerService.LogError($"REQUESTS-FOR-MENTAL-HEALTH-EXPERT: {e.Message}");
                throw;
            }
        }
    }
}
