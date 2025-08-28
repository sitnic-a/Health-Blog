namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class SharesPerMentalHealthExpertDto
    {
        public UserDto MentalHealthExpertContentSharedWith { get; set; }
        public List<PostDto> SharedContent { get; set; }
        public List<PostDto> History { get; set; }

        public SharesPerMentalHealthExpertDto(){}

        public SharesPerMentalHealthExpertDto(UserDto mentalHealthExpertContentSharedWith, List<PostDto> sharedContent, List<PostDto>? history=null)
        {
            MentalHealthExpertContentSharedWith = mentalHealthExpertContentSharedWith;
            SharedContent = sharedContent;
            History = history;
        }
    }
}
