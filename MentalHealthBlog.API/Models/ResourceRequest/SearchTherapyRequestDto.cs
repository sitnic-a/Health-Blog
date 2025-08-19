namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SearchTherapyRequestDto
    {
        public int LoggedUserId { get; set; }
        public RequestStatusEnum? RequestStatus { get; set; }

        public SearchTherapyRequestDto(){}
        public SearchTherapyRequestDto(int loggedUserId,RequestStatusEnum requestStatus)
        {
            LoggedUserId = loggedUserId;
            RequestStatus = requestStatus;
        }
    }
}
