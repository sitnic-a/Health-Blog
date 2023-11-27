﻿namespace MentalHealthBlog.API.Models.ResourceResponse
{
    public class UserLoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool? RememberMe { get; set; }

        public UserLoginDto(){}
    }
}
