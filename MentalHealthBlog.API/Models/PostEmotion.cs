using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Models
{
    public class PostEmotion
    {
        public int PostId { get; set; }
        public Post Post{ get; set; }
        public int EmotionId { get; set; }
        public Emotion Emotion{ get; set; }
        public PostEmotion(){}
        public PostEmotion(int postId, int emotionId)
        {
            PostId = postId;
            EmotionId = emotionId;
        }
    }
}
