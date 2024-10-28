﻿using iText.Layout.Properties;

namespace MentalHealthBlog.API.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public Role(){}
        public Role(int id, string name)
        {
            Id = id;
            Name = name;
        }
    }
}
