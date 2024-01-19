using AutoMapper;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlogAPI.Models;

namespace MentalHealthBlog.API.Utils.Mapper
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<Post, CreatePostDto>().ReverseMap();
        }
    }
}
