using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.ExtensionMethods.ExtensionPostClass;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MentalHealthBlogAPI.Services
{
    enum PostServiceLogTypes
    {
        POST_NULL,
        POST_EMPTY,
        POST_INVALID_DATA,
        POSTS_SUCCESS,
        POSTS_FAILED
    }

    public class PostService : IPostService
    {
        private readonly DataContext _context;
        private readonly ILogger<PostService> _postServiceLogger;
        private readonly IMapper _mapper;

        public PostService(DataContext context, IMapper mapper, ILogger<PostService> postServiceLogger)
        {
            _context = context;
            _mapper = mapper;
            _postServiceLogger = postServiceLogger;
        }
        public async Task<Response> GetPosts(SearchPostDto query)
        {
            try
            {
                var dbPosts = _context.Posts.Where(p => p.UserId == query.UserId);

                if (!await dbPosts.AnyAsync())
                {
                    _postServiceLogger.LogInformation($"GET: {PostServiceLogTypes.POST_EMPTY.ToString()}");
                    return new Response(new List<PostDto>(), StatusCodes.Status200OK, $"GET: {PostServiceLogTypes.POST_EMPTY.ToString()}");
                }

                if (query.MonthOfPostCreation.HasValue && query.MonthOfPostCreation > 0)
                {
                    dbPosts = dbPosts.Where(p => p.CreatedAt.Month == query.MonthOfPostCreation);
                }

                var filteredPosts = await dbPosts
                    .OrderByDescending(p => p.Id)
                    .ToListAsync();

                var posts = new List<PostDto>();
                var postDto = new PostDto();
                var postHelper = new PostHelper(_context);

                foreach (var item in filteredPosts)
                {
                    var dbPostTags = await postHelper.CallReturnPostTagsAsync(item.Id);
                    var dbPostEmotions = await postHelper.CallReturnPostEmotionsAsync(item.Id);

                    postDto = _mapper.Map<PostDto>(item);
                    postDto.Tags = dbPostTags;
                    postDto.Emotions = dbPostEmotions;
                    posts.Add(postDto);
                   
                    continue;
                }

                if (filteredPosts.Any() && !posts.Any())
                {
                    _postServiceLogger.LogWarning($"GET: {PostServiceLogTypes.POST_NULL.ToString()}");
                    throw new RecordNotFoundException("Posts not retrieved properly!");
                }

                if (!posts.Any())
                {
                    _postServiceLogger.LogInformation($"GET: {PostServiceLogTypes.POST_EMPTY.ToString()}");
                    return new Response(new List<PostDto>(), StatusCodes.Status200OK, PostServiceLogTypes.POST_EMPTY.ToString());
                }

                _postServiceLogger.LogInformation($"GET: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(posts, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());

            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                throw;
            }
        }

        public async Task<Response> GetById(int id)
        {
            try
            {
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"GET/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    throw new RecordNotFoundException("Post not found!");
                }
                _postServiceLogger.LogInformation($"GET/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(searched, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                throw;
            }
        }

        public async Task<Response> Add(CreatePostDto post)
        {
            try
            {
                var postHelper = new PostHelper(_context);

                if (!await postHelper.PostRequestIsValid(post))
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_INVALID_DATA.ToString()}", post);
                    throw new ArgumentException("Bad request!");
                }

                var mappedPost = _mapper.Map<Post>(post);
                var hasAtLeastOneTagPicked = post.Tags.Any();
                var hasAtLeastOnEmotionPicked = post.Emotions.Any();

                if (hasAtLeastOneTagPicked)
                {
                    foreach (var item in post.Tags)
                    {
                        var existingTag = await _context.Tags.FirstOrDefaultAsync(t => t.Name == item) != null;
                        
                        if (!existingTag)
                        {
                            var newTag = new Tag { Name = item };
                            await _context.Tags.AddAsync(newTag);
                        }
                    }
                }

                if (mappedPost.IsNullOrEmpthy() || !hasAtLeastOneTagPicked)
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_INVALID_DATA.ToString()}");
                    throw new CreateRecordException("Couldn't create new post. Invalid data!");
                }

                var newPost = await _context.Posts.AddAsync(mappedPost);
                await _context.SaveChangesAsync();

                if (newPost is null)
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_NULL.ToString()}");
                    throw new RecordNotFoundException("New post is not created!");
                }

                foreach (var item in post.Tags)
                {
                    var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Name == item);
                    if (tag != null)
                    {
                        var postTag = new PostTag(newPost.Entity.Id, tag.Id);
                        await _context.PostsTags.AddAsync(postTag);
                    }
                }

                if (hasAtLeastOnEmotionPicked)
                {
                    foreach (var emotionId in post.Emotions)
                    {
                        if (emotionId <= 0)
                        {
                            continue;
                        }
                        var postEmotion = new PostEmotion(newPost.Entity.Id, emotionId);
                        await _context.PostsEmotions.AddAsync(postEmotion);
                    }
                }

                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"POST: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(newPost.Entity, StatusCodes.Status201Created, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"POST: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                throw;
            }
        }
        public async Task<Response> Update(int id, Post post)
        {
            try
            {
                var postHelper = new PostHelper(_context);

                if (!await postHelper.PostRequestIsValid(post))
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_INVALID_DATA.ToString()}");
                    throw new ArgumentException("Bad request!");
                }

                var searched = await _context.Posts.FindAsync(id);

                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    throw new RecordNotFoundException("Post can't be updated! Post doesn't exist!");
                }

                searched.Id = id;
                searched.Title = post.Title;
                searched.Content = post.Content;
                searched.UserId = post.UserId;
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"PUT/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(searched, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"PUT/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                throw;
            }
        }

        public async Task<Response> Delete(int id)
        {
            try
            {
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"DELETE/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
                }
                _context.Posts.Remove(searched);
                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"DELETE/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(searched, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"DELETE/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
            }
        }
    }
}
