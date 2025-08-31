using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MentalHealthBlog.API.Models
{
    public class TherapyRequest
    {
        public int RegularUserId { get; set; }
        public RegularUser? RegularUser { get; set; }
        public int MentalHealthExpertId { get; set; }

        public RequestStatusEnum RequestStatus { get; set; } = RequestStatusEnum.Pending;
        
        [NpgsqlTypes.PgName("TIMESTAMP")]
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public TherapyRequest() { }
        public TherapyRequest(int regularUserId, int mentalHealthExpertId)
        {
            RegularUserId = regularUserId;
            MentalHealthExpertId = mentalHealthExpertId;
        }
    }
}
