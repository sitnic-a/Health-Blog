namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class SharesPerMentalHealthExpertDto
    {
        public UserDto MentalHealthExpertContentSharedWith { get; set; }
        public List<PostDto> SharedContent { get; set; }

        public SharesPerMentalHealthExpertDto(){}

        public SharesPerMentalHealthExpertDto(UserDto mentalHealthExpertContentSharedWith, List<PostDto> sharedContent)
        {
            MentalHealthExpertContentSharedWith = mentalHealthExpertContentSharedWith;
            SharedContent = sharedContent;
        }
    }
}
