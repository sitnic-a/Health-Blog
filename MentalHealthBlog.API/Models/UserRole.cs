using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Models
{
    public class UserRole
    {
        public int UserId { get; set; }

        public int RoleId { get; set; }

        public UserRole(){}
        public UserRole(int userId, int roleId)
        {
            UserId = userId;
            RoleId = roleId;
        }
    }
}
