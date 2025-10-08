using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentService _assignmentService;
        public AssignmentController(IAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet("assignment-responses/{assignmentId}")]
        public async Task<Response> GetAssignmentResponses(int assignmentId)
        {
            return await _assignmentService.GetAssignmentResponses(assignmentId);
        }

        [HttpPost("users-assignments")]
        public async Task<Response> GetUsersAssignments([FromBody] SearchAssignmentDto request)
        {
            return await _assignmentService.GetUsersAssignments(request);
        }

        [HttpPost("respond")]
        public async Task<Response> RespondToAssignment([FromBody] CreateAssignmentResponseDto request)
        {
            return await _assignmentService.RespondToAssignment(request);
        }
    }
}
