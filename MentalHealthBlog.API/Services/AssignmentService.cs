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
        public async Task<Response> GetUsersAssignments(SearchAssignmentDto request)
        {
            try
            {
                if (request == null || request.GivenToId <= 0 || request.GivenById <= 0)
                {
                    _assignmentLoggerService.LogWarning($"USERS-ASSIGNMENTS: {AssignmentLogTypes.INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var dbAssignmentsByUser = await _context.Assignments
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

                var usersAssignments = new List<Assignment>();

                foreach (var assignmentByUser in dbAssignmentsByUser)
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
    }
}
