namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class _PartialCombinedUserDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool IsMentalHealthExpert { get; set; }

        public _PartialCombinedUserDto(){}
        public _PartialCombinedUserDto(int id, string email)
        {
            Id = id;
            Email = email;
        }
    }
}
