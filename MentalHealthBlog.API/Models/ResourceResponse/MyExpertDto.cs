namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class MyExpertDto
    {
        public int MentalHealthExpertId { get; set; }
        public int MentalHealthExpertUserId { get; set; }
        public MentalHealthExpert? MentalHealthExpert { get; set; }
        public int RegularUserId { get; set; }
        public string MentalHealthExpertUsername { get; set; } = string.Empty;
        public string MentalHealthExpertFirstName { get; set; } = string.Empty;
        public string MentalHealthExpertLastName { get; set; } = string.Empty;
        public string MentalHealthExpertOrganization { get; set; } = string.Empty;
        public string MentalHealthExpertEmail { get; set; } = string.Empty;
        public string MentalHealthExpertPhoneNumber { get; set; } = string.Empty;
        public string MentalHealthExpertPhotoAsPath { get; set; } = string.Empty;
        public byte[] MentalHealthExpertPhotoAsFile { get; set; }
        public RequestStatusEnum RequestStatus { get; set; }
    }
}
