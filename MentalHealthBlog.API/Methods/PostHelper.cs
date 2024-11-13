using MentalHealthBlogAPI.Data;
using Microsoft.EntityFrameworkCore;

#pragma warning disable CS8602

namespace MentalHealthBlog.API.Methods
{
    public class PostHelper
    {
        private readonly DataContext _context;
        public PostHelper(DataContext context)
        {
            _context = context;
        }

        private List<string> ReturnPostTags(int postId)
        {
            if (_context is not null)
            {
                var postTags = _context.PostsTags
                    .Include(t => t.Tag)
                    .Where(p => p.PostId == postId)
                    .ToList();

                var tags = new List<string>();
                foreach (var postTag in postTags)
                {
                    if (postTag is not null)
                    {
                        tags.Add(postTag.Tag.Name);
                    }
                }
                return tags;
            }
            return new List<string>();
        }

        public List<string> CallReturnPostTags(int postId)
        {
            return ReturnPostTags(postId);
        }
    }
}
