namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class CurrentAndHistorySharedContent
    {
        public List<PostDto> SharedContent { get; set; } = new List<PostDto>();
        public List<PostDto> History { get; set; } = new List<PostDto>();

        public CurrentAndHistorySharedContent() { }
        public CurrentAndHistorySharedContent(List<PostDto> sharedContent, List<PostDto> history)
        {
            SharedContent = sharedContent;
            History = history;
        }
    }
}
