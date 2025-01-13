namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class RegisterExpertPatchDto
    {
        public int MentalHealthExpertId { get; set; }
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }

        public RegisterExpertPatchDto()
        {
            
        }
    }
}
