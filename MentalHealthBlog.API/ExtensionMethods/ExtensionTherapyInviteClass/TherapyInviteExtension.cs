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
                 string.IsNullOrEmpty(request.SendEmailTo) ||
                 string.IsNullOrWhiteSpace(request.SendEmailTo) ||
                 request.MentalHealthExpertId <= 0)
            {
                return false;
            }

            return true;
        }

        public static bool IsTherapyInviteValid(this TherapyInvite request)
        {
            if (string.IsNullOrEmpty(request.Id) ||
                string.IsNullOrWhiteSpace(request.Id) ||
                request.MentalHealthExpertId <= 0)
            {
                return false;
            }
            return true;
        }

    }
}
