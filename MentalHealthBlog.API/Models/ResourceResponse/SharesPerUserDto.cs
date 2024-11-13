#pragma warning disable CS8618

using System.Collections.Generic;

namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class SharesPerUserDto
    {
        public UserDto UserThatSharedContent { get; set; } = new UserDto();
        public List<PostDto> SharedContent { get; set; } = new List<PostDto>();

        public SharesPerUserDto(){}
        public SharesPerUserDto(UserDto userThatSharedContent, List<PostDto> sharedContent)
        {
            UserThatSharedContent = userThatSharedContent;
            SharedContent = sharedContent;
        }
    }
}
