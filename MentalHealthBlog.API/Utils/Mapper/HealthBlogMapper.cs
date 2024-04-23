using AutoMapper;
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
        }
    }
}
