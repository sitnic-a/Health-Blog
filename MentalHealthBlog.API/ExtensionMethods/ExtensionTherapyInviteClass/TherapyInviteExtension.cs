using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Services;
using System.ComponentModel;

namespace MentalHealthBlog.API.ExtensionMethods.ExtensionTherapyInviteClass
{
    public static class TherapyInviteExtension
    {

        public static bool IsRequestForTherapyValid(this InviteDto request)
        {
            if (request == null ||
                 string.IsNullOrEmpty(request.Email) ||
                 string.IsNullOrWhiteSpace(request.Email) ||
                 request.MentalHealthExpertId <= 0)
            {
                return false;
            }

            return true;
        }

        public static bool IsTherapyInviteValid(this TherapyInvite request)
        {
            if (request.Id == Guid.Empty ||
                request.MentalHealthExpertId <= 0)
            {
                return false;
            }
            return true;
        }

    }
}
