namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class RegisterExpertPatchDto
    {
        public int MentalHealthExpertId { get; set; }
        public bool Approval { get; set; }

        public RegisterExpertPatchDto()
        {
            
        }
    }
}
