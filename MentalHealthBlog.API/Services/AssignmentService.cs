using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.GroupingModels;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MentalHealthBlog.API.Services
{
    enum AssignmentLogTypes
    {
        INVALID_DATA,
        SUCCESS,
        EMPTY,
        NOT_FOUND,
        NOT_IN_THERAPY,
        NOT_RESPONDED
    }
    public class AssignmentService : IAssignmentService
    {
        private readonly DataContext _context;
        private readonly ILogger<IAssignmentService> _assignmentLoggerService;
        public AssignmentService(DataContext context, ILogger<IAssignmentService> assignmentLoggerService)
        {
            _context = context;
            _assignmentLoggerService = assignmentLoggerService;
        }

        public async Task<Response> GetAssignmentResponses(int assignmentId)
        {
            try
            {
                if (assignmentId <= 0)
                {
                    _assignmentLoggerService.LogWarning($"ASSIGNMENT-RESPONSES/[id]: {AssignmentLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbAssignmentResponses = await _context.AssignmentResponses
                    .Where(ar => ar.AssignmentId == assignmentId)
                    .OrderByDescending(ar => ar.WrittenAt)
                    .ToListAsync();

                if (!dbAssignmentResponses.Any())
                {
                    _assignmentLoggerService.LogWarning($"ASSIGNMENT-RESPONSES/[id]: {AssignmentLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("No data found!");
                }

                _assignmentLoggerService.LogInformation($"ASSIGNMENT-RESPONSES/[id]: {AssignmentLogTypes.SUCCESS.ToString()}");
                return new Response(dbAssignmentResponses, StatusCodes.Status200OK, $"ASSIGNMENT-RESPONSES/[id]: {AssignmentLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _assignmentLoggerService.LogError($"ASSIGNMENT-RESPONSES/[id]: {e.Message}");
                throw;
            }


        }

        public async Task<Response> GetUsersAssignments(SearchAssignmentDto request)
        {
            try
            {
                if (request == null || request.GivenToId <= 0 || request.GivenById <= 0)
                {
                    _assignmentLoggerService.LogWarning($"USERS-ASSIGNMENTS: {AssignmentLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                if (!_context.TherapyRequests.Any(tr => tr.RegularUserId == request.GivenToId &&
                                                 tr.MentalHealthExpertId == request.GivenById &&
                                                 tr.RequestStatus == RequestStatusEnum.Approved))
                {
                    _assignmentLoggerService.LogWarning($"USERS-ASSIGNMENT: {AssignmentLogTypes.NOT_IN_THERAPY.ToString()}");
                    throw new RecordNotFoundException("Couldn't review such assignments!");
                }

                List<AssignmentsGroup> dbAssignmentsByUser = new List<AssignmentsGroup>();

                if (request.IsMentalHealthExpert == true)
                {
                    dbAssignmentsByUser = await _context.Assignments
                    .Where(a => a.AssignmentGivenById == request.GivenById)
                    .GroupBy(a => a.AssignmentGivenToId)
                    .Select(assignmentPerUser => new AssignmentsGroup
                    {
                        Key = assignmentPerUser.Key,
                        Assignments = assignmentPerUser
                        .OrderByDescending(a => a.CreatedAt)
                        .ToList()
                    })
                    .ToListAsync();
                }

                if (request.IsMentalHealthExpert == false)
                {
                    dbAssignmentsByUser = await _context.Assignments
                    .Where(a => a.AssignmentGivenToId == request.GivenToId)
                    .GroupBy(a => a.AssignmentGivenById)
                    .Select(assignmentPerUser => new AssignmentsGroup
                    {
                        Key = assignmentPerUser.Key,
                        Assignments = assignmentPerUser
                        .OrderByDescending(a => a.CreatedAt)
                        .ToList()
                    })
                    .ToListAsync();
                }

                var usersAssignments = new List<Assignment>();

                foreach (var assignmentByUser in dbAssignmentsByUser)
                {
                    if (request.IsMentalHealthExpert == true)
                    {
                        if (assignmentByUser.Key == request.GivenToId)
                        {
                            if (assignmentByUser.Key > 0)
                            {

                                usersAssignments = assignmentByUser.Assignments;
                                break;
                            }

                            _assignmentLoggerService.LogWarning($"USERS-ASSIGNMENTS: {AssignmentLogTypes.NOT_FOUND.ToString()}");
                            throw new ArgumentOutOfRangeException("Impossible to have elements with such id");
                        }
                        continue;
                    }

                    if (request.IsMentalHealthExpert == false)
                    {
                        if (assignmentByUser.Key == request.GivenById)
                        {
                            if (assignmentByUser.Key > 0)
                            {
                                usersAssignments = assignmentByUser.Assignments;
                                break;
                            }

                            _assignmentLoggerService.LogWarning($"USERS-ASSIGNMENTS: {AssignmentLogTypes.NOT_FOUND.ToString()}");
                            throw new ArgumentOutOfRangeException("Impossible to have elements with such id");
                        }
                        continue;
                    }
                }

                if (usersAssignments.IsNullOrEmpty())
                {
                    _assignmentLoggerService.LogWarning($"USERS-ASSIGNMENTS: {AssignmentLogTypes.EMPTY.ToString()}");
                    throw new RecordNotFoundException("Assignment not loaded properly!");
                }

                _assignmentLoggerService.LogInformation($"USERS-ASSIGNMENTS: {AssignmentLogTypes.SUCCESS.ToString()}");
                return new Response(usersAssignments, StatusCodes.Status200OK, $"USERS-ASSIGNMENTS: {AssignmentLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _assignmentLoggerService.LogError($"USERS-ASSIGNMENTS: {e.Message}");
                throw;
            }
        }

        public async Task<Response> RespondToAssignment(CreateAssignmentResponseDto request)
        {
            try
            {
                if (request == null ||
                request.AssignmentId <= 0 ||
                request.ResponseById <= 0 ||
                string.IsNullOrEmpty(request.Content) ||
                string.IsNullOrWhiteSpace(request.Content))
                {
                    _assignmentLoggerService.LogWarning($"RESPOND: {AssignmentLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbAssignment = await _context.Assignments.FindAsync(request.AssignmentId);

                if(dbAssignment == null)
                {
                    _assignmentLoggerService.LogWarning($"RESPOND: {AssignmentLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Not found!");
                }

                if (dbAssignment.AssignmentGivenById != request.ResponseById && 
                    dbAssignment.AssignmentGivenToId != request.ResponseById)
                {
                    _assignmentLoggerService.LogWarning($"RESPOND: {AssignmentLogTypes.NOT_IN_THERAPY.ToString()}");
                    throw new RecordNotFoundException("Impossible to review data!");
                }

                var assignmentResponse = new AssignmentResponse(request.AssignmentId, request.ResponseById, request.Content, DateTime.UtcNow);

                if (assignmentResponse != null)
                {
                    _context.AssignmentResponses.Add(assignmentResponse);
                    await _context.SaveChangesAsync();
                    var assignmentResponsesServiceResponseObject = await GetAssignmentResponses(request.AssignmentId);
                    var dbAssignmentResponses = assignmentResponsesServiceResponseObject.ServiceResponseObject;
                    _assignmentLoggerService.LogInformation($"RESPOND: {AssignmentLogTypes.SUCCESS.ToString()}");
                    return new Response(dbAssignmentResponses, StatusCodes.Status201Created, $"RESPOND: {AssignmentLogTypes.SUCCESS.ToString()}");
                }

                _assignmentLoggerService.LogWarning($"RESPOND: {AssignmentLogTypes.NOT_RESPONDED.ToString()}");
                throw new CreateRecordException("Response cannot be created!");
            }
            catch (Exception e)
            {
                _assignmentLoggerService.LogError($"RESPOND: {e.Message}");
                throw;
            }
            
        }
    }
}
