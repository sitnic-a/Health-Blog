using AutoMapper;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Utils.Mapper
{
    public class HealthBlogMapper : Profile
    {
        public HealthBlogMapper()
        {
            CreateMap<Post, CreatePostDto>().ReverseMap();
            CreateMap<Post,PostDto>().ReverseMap();
            CreateMap<IEnumerable<Post>, IEnumerable<Post>>();
            CreateMap<MentalHealthExpert, MentalHealthExpertDto>().ReverseMap();
            CreateMap<CreateMentalHealthExpertDto, MentalHealthExpert>().ReverseMap();
            CreateMap<UserDto,MentalHealthExpert>().ReverseMap();
            CreateMap<UserDto, User>().ReverseMap();
            CreateMap<CreateAssignmentDto, Assignment>().ReverseMap();
            CreateMap<MentalHealthExpert,TrialPeriodDto>().ReverseMap();
            CreateMap<RegularUser,TrialPeriodDto>().ReverseMap();
            CreateMap<MentalHealthExpert, UserTrialSubscriptionDto>().ReverseMap();
            CreateMap<RegularUser, UserTrialSubscriptionDto>().ReverseMap();
        }
    }
}
