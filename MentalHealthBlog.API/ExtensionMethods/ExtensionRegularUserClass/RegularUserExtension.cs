using iText.Layout.Element;
using MentalHealthBlog.API.Models.ResourceRequest;
using Microsoft.IdentityModel.Tokens;

namespace MentalHealthBlog.API.ExtensionMethods.ExtensionRegularUserClass
{
    static public class RegularUserExtension
    {
        static public bool IsValid(this CreateRegularUserDto newRegularUserRequest)
        {
            if (newRegularUserRequest.IsInTherapy == false)
            {
                return !string.IsNullOrEmpty(newRegularUserRequest?.FirstName) ||
                           !string.IsNullOrWhiteSpace(newRegularUserRequest?.FirstName) ||
                           !string.IsNullOrEmpty(newRegularUserRequest?.LastName) ||
                           !string.IsNullOrWhiteSpace(newRegularUserRequest?.LastName) ||
                           !string.IsNullOrEmpty(newRegularUserRequest?.Email) ||
                           !string.IsNullOrWhiteSpace(newRegularUserRequest?.Email);
            }
            if (newRegularUserRequest?.IsInTherapy == true)
            {
                bool hasData = newRegularUserRequest.MentalHealthExpertsToConnectWithIds.Any();

                return !string.IsNullOrEmpty(newRegularUserRequest?.FirstName) ||
                              !string.IsNullOrWhiteSpace(newRegularUserRequest?.FirstName) ||
                              !string.IsNullOrEmpty(newRegularUserRequest?.LastName) ||
                              !string.IsNullOrWhiteSpace(newRegularUserRequest?.LastName) ||
                              !string.IsNullOrEmpty(newRegularUserRequest?.Email) ||
                              !string.IsNullOrWhiteSpace(newRegularUserRequest?.Email) ||
                              hasData;
            }
            return false;
        }
    }
}
