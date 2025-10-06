using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;

namespace MentalHealthBlog.API.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly DataContext _context;
        private readonly ILogger<IAssignmentService> _assignmentLoggerService;
        public AssignmentService(DataContext context, ILogger<IAssignmentService> assignmentLoggerService)
        {
            _context = context;
            _assignmentLoggerService = assignmentLoggerService;
        }
        public Task<Response> GetAssignmentsPerUser()
        {
            throw new NotImplementedException();
        }
    }
}
