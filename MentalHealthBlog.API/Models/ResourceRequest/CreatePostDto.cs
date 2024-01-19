﻿namespace MentalHealthBlog.API.Models.ResourceRequest
{
    public class CreatePostDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        
        public CreatePostDto(){}

    }
}
