#pragma warning disable CS8629

namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class ExpertSearchContentDto
    {
        public int LoggedExpertId { get; set; }
        public DateTime FromCreatedAt { get; set; } = DateTime.MinValue;
        public DateTime ToCreatedAt { get; set; } = DateTime.MinValue;

        public ExpertSearchContentDto(){}
        public ExpertSearchContentDto(int loggedExpertId, DateTime? fromCreatedAt = null, DateTime? toCreatedAt=null)
        {
            LoggedExpertId = loggedExpertId;
            FromCreatedAt = fromCreatedAt.Value;
            ToCreatedAt = toCreatedAt.Value;
        }
    }
}
