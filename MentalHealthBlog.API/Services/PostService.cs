﻿using AutoMapper;
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
        POST_INVALID_DATA,
        POSTS_SUCCESS,
        POSTS_FAILED
    }

    public class PostService : IPostService
    {
        private readonly DataContext _context;
        private readonly ILogger<PostService> _postServiceLogger;
        private readonly IMapper _autoMapper;

        public PostService(DataContext context, IMapper mapper, ILogger<PostService> postServiceLogger)
        {
            _context = context;
            _autoMapper = mapper;
            _postServiceLogger = postServiceLogger;
        }
        public async Task<Response> GetPosts(SearchPostDto query)
        {
            var dbPosts = _context.Posts.Where(p => p.UserId == query.UserId);

            if (query.MonthOfPostCreation.HasValue && query.MonthOfPostCreation > 0)
            {
                dbPosts = dbPosts.Where(p => p.CreatedAt.Month == query.MonthOfPostCreation);
            }

            var filteredPosts = await dbPosts.OrderByDescending(p => p.Id).ToListAsync();

            var posts = new List<PostDto>();
            var postDto = new PostDto();
            var postHelper = new PostHelper(_context);

            foreach (var item in filteredPosts)
            {
                var dbPostTags = await postHelper.CallReturnPostTagsAsync(item.Id);
                var dbPostEmotions = await postHelper.CallReturnPostEmotionsAsync(item.Id);

                var tagsOnPost = dbPostTags.Count;
                var emotionsOnPost = dbPostEmotions.Count;

                if (tagsOnPost > 0 && emotionsOnPost > 0)
                {
                    postDto = _autoMapper.Map<PostDto>(item);
                    postDto.Tags = dbPostTags;
                    postDto.Emotions = dbPostEmotions;
                    posts.Add(postDto);
                    continue;
                }

                postDto = _autoMapper.Map<PostDto>(item);
                postDto.Tags = new List<string>();
                postDto.Emotions = new List<EmotionDto>();
                posts.Add(postDto);
                continue;
            }
            try
            {
                if (posts is null)
                {
                    _postServiceLogger.LogWarning($"GET: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
                }
                _postServiceLogger.LogInformation($"GET: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(posts, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
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
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
                }
                _postServiceLogger.LogInformation($"GET/id: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(searched, StatusCodes.Status200OK, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"GET/id: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
            }
        }

        public async Task<Response> Add(CreatePostDto post)
        {
            try
            {
                var mappedPost = _autoMapper.Map<Post>(post);
                var tagsNumber = post.Tags.Count;
                var emotionsNumber = post.Emotions.Count;

                if (tagsNumber > 0)
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

                if (mappedPost.IsNullOrEmpthy() || tagsNumber <= 0)
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_INVALID_DATA.ToString()}");
                    return new Response(new object(), StatusCodes.Status400BadRequest, PostServiceLogTypes.POST_INVALID_DATA.ToString());
                }

                var newPost = await _context.Posts.AddAsync(mappedPost);
                await _context.SaveChangesAsync();
                if (newPost is null)
                {
                    _postServiceLogger.LogWarning($"POST: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
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

                if (emotionsNumber > 0)
                {
                    foreach (var emotionId in post.Emotions)
                    {
                        if (emotionId <= 0)
                        {
                            continue;
                        }
                        var postEmotion = new PostEmotion(newPost.Entity.Id, emotionId);
                        _context.PostsEmotions?.AddAsync(postEmotion);
                    }
                }

                await _context.SaveChangesAsync();
                _postServiceLogger.LogInformation($"POST: {PostServiceLogTypes.POSTS_SUCCESS.ToString()}");
                return new Response(newPost.Entity, StatusCodes.Status201Created, PostServiceLogTypes.POSTS_SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _postServiceLogger.LogError($"POST: {PostServiceLogTypes.POSTS_FAILED.ToString()}", e);
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
            }
        }
        public async Task<Response> Update(int id, Post post)
        {
            try
            {
                if (post.IsNullOrEmpthy())
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_INVALID_DATA.ToString()}");
                    return new Response(new object(), StatusCodes.Status400BadRequest, PostServiceLogTypes.POST_INVALID_DATA.ToString());
                }
                var searched = await _context.Posts.FindAsync(id);
                if (searched is null)
                {
                    _postServiceLogger.LogWarning($"PUT/id: {PostServiceLogTypes.POST_NULL.ToString()}");
                    return new Response(new object(), StatusCodes.Status204NoContent, PostServiceLogTypes.POST_NULL.ToString());
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
                return new Response(e.Data, StatusCodes.Status400BadRequest, PostServiceLogTypes.POSTS_FAILED.ToString());
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
