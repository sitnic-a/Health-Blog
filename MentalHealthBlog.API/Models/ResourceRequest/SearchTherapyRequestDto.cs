namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class SearchTherapyRequestDto
    {
        public int _LoggedUserId { get; set; }
        public RequestStatusEnum RequestStatus { get; set; }

        public SearchTherapyRequestDto(){}
        public SearchTherapyRequestDto(int loggedUserId,RequestStatusEnum requestStatus)
        {
            _LoggedUserId = loggedUserId;
            RequestStatus = requestStatus;
        }
    }
}
