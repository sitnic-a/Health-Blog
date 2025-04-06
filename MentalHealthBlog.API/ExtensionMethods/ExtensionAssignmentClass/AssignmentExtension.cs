using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using Microsoft.IdentityModel.Tokens;
using System.Runtime.CompilerServices;

namespace MentalHealthBlog.API.ExtensionMethods.ExtensionAssignmentClass
{
    public static class AssignmentExtension
    {
        public static bool IsValid(this CreateAssignmentDto assignment)
        {
            if (assignment.AssignmentGivenToId <= 0 ||
                assignment.AssignmentGivenById <= 0 ||
                assignment.Content.IsNullOrEmpty()) return false;

            return true;
        }
    }
}
