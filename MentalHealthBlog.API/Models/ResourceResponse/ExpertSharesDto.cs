using System.Collections.Generic;
using MentalHealthBlog.API.Models.GroupingModels;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class ExpertSharesDto
    {
        public IQueryable<IGrouping<User, Share>> SharesPerUser { get; set; }
        public ExpertSharesDto(){}
        public ExpertSharesDto(IQueryable<IGrouping<User, Share>> sharesPerUser)
        {
            SharesPerUser = sharesPerUser;
        }
    }
}
