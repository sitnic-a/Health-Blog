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

        [HttpGet("link/{shareId}")]
        public async Task<Response> ShareByLink(string shareId)
        {
            return await _shareService.ShareByLink(shareId);
        }

        [HttpPost]
        public async Task<Response> ShareContent(ShareContentDto contentToBeShared)
        {
            return await _shareService.ShareContent(contentToBeShared);
        }

        [HttpGet("experts-relatives")]
        public async Task<Response> GetExpertsRelatives()
        {
            return await _shareService.GetExpertsAndRelatives();
        }

    }
}
