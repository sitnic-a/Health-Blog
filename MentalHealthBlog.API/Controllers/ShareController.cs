﻿using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlog.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentalHealthBlog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShareController : ControllerBase
    {
        private readonly IShareService _shareService;

        public ShareController(IShareService shareService)
        {
            _shareService = shareService;
        }

        [HttpPost]
        public async Task<List<Share>> ShareContent(ShareContentDto contentToBeShared)
        {
            return await _shareService.ShareContent(contentToBeShared);
        }

        [HttpGet("experts-relatives")]
        public async Task<List<UserDto>> GetExpertsRelatives()
        {
            return await _shareService.GetExpertsAndRelatives();
        }

    }
}