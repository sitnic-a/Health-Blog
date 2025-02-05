namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class RecentSharesDto
    {
        public PostDto SharedPost { get; set; }
        public UserDto SharedWith { get; set; }

        public RecentSharesDto(){}

        public RecentSharesDto(PostDto sharedPost, UserDto sharedWith)
        {
            SharedPost = sharedPost;
            SharedWith = sharedWith;
        }
    }
}
