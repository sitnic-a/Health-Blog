using AutoMapper;
using MentalHealthBlog.API.Exceptions;
using MentalHealthBlog.API.ExtensionMethods.ExtensionAssignmentClass;
using MentalHealthBlog.API.Methods;
using MentalHealthBlog.API.Models;
using MentalHealthBlog.API.Models.ResourceRequest;
using MentalHealthBlog.API.Models.ResourceResponse;
using MentalHealthBlogAPI.Data;
using MentalHealthBlogAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;

#pragma warning disable CS8620
#pragma warning disable CS8602

namespace MentalHealthBlog.API.Services
{
    enum MentalExpertServiceLogTypes
    {
        EMPTY,
        ASSIGNMENT_INVALID_DATA,
        NOT_FOUND,
        SUCCESS,
        ERROR
    }

    public class MentalExpertService : IMentalExpertService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<IMentalExpertService> _mentalExpertLoggerService;

        public MentalExpertService(DataContext context, IMapper mapper, ILogger<IMentalExpertService> mentalExpertLoggerService)
        {
            _context = context;
            _mapper = mapper;
            _mentalExpertLoggerService = mentalExpertLoggerService;
        }


        public async Task<Response> GetMentalHealthExperts(SearchExpertDto? request)
        {
            try
            {
                var mentalHealthExperts = new List<MentalHealthExpertDto>();
                List<MentalHealthExpert> dbMentalHealthExperts = new List<MentalHealthExpert>();
                List<TherapyMentalHealthExpertDto> dbMentalHealthExpertsCombinedWithTherapies = new List<TherapyMentalHealthExpertDto>();

                if (request is not null)
                {
                    //dbMentalHealthExpertsCombinedWithTherapies = await _context.TherapyRequests
                    //    .Select(tr => new TherapyMentalHealthExpertDto
                    //    {
                    //        MentalHealthExpertId = tr.MentalHealthExpertId,
                    //        FirstName = _context.MentalHealthExperts.(tr.MentalHealthExpertId).FirstName,
                    //        LastName = _context.MentalHealthExperts.Find(tr.MentalHealthExpertId).LastName,
                    //        Organization = _context.MentalHealthExperts.Find(tr.MentalHealthExpertId).Organization,
                    //        PhoneNumber = _context.MentalHealthExperts.Find(tr.MentalHealthExpertId).PhoneNumber,
                    //        Email = _context.MentalHealthExperts.Find(tr.MentalHealthExpertId).Email,
                    //        RequestStatus = tr.RequestStatus,
                    //        RegularUserId = tr.RegularUserId,
                    //    })
                    //    .DistinctBy(tr => tr.MentalHealthExpertId)
                    //    .ToListAsync();

                    //if (!dbMentalHealthExpertsCombinedWithTherapies.Any())
                    //{
                    //    _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    //    throw new EmptyListException("No records found in database");
                    //}

                    //_mentalExpertLoggerService.LogInformation($"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                    //return new Response(dbMentalHealthExpertsCombinedWithTherapies, StatusCodes.Status200OK, $"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                }

                dbMentalHealthExperts = await _context.MentalHealthExperts
                    .OrderByDescending(mhe => mhe.FirstName)
                    .Where(mhe => mhe.IsApproved == true)
                    .ToListAsync();

                if (!dbMentalHealthExperts.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("No records found in database");
                }

                foreach (var dbMentalHealthExpert in dbMentalHealthExperts)
                {
                    var mentalHealthExpertDto = _mapper.Map<MentalHealthExpertDto>(dbMentalHealthExpert);

                    if (mentalHealthExpertDto == null)
                    {
                        _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                        throw new EmptyListException("Mental health expert doesn't exist");
                    }
                    mentalHealthExperts.Add(mentalHealthExpertDto);
                }

                if (!mentalHealthExperts.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"EXPERTS: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    throw new EmptyListException("Experts are not found!");
                }

                _mentalExpertLoggerService.LogInformation($"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
                return new Response(mentalHealthExperts, StatusCodes.Status200OK, $"EXPERTS: {MentalExpertServiceLogTypes.SUCCESS.ToString()}");
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"EXPERTS: {e.Message}", e);
                throw;
            }

        }

        public async Task<Response> GetSharesPerUser(ExpertSearchContentDto query)
        {
            try
            {
                if (query == null || query.LoggedExpertId <= 0)
                {
                    _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.ERROR.ToString()} - QUERY NULL OR WRONG", query);
                    throw new ArgumentException("Bad request!");
                }

                var mentalHealthExpert = await _context.MentalHealthExperts
                    .SingleOrDefaultAsync(mhe => mhe.UserId == query.LoggedExpertId);

                var dbShares = await _context.Shares
                    .Where(mhe => mhe.SharedWithId == mentalHealthExpert.Id)
                    .Include(p => p.SharedPost)
                    .Include(u => u.SharedPost.User)
                    .ToListAsync();
                var isSharedWithThisMentalHealthExpert = dbShares.Any();

                if (!isSharedWithThisMentalHealthExpert)
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                    return new Response(new List<SharesPerUserDto>(), StatusCodes.Status200OK, $"SHARES-PER-USER: {MentalExpertServiceLogTypes.EMPTY.ToString()}");
                }

                var groupedUsersAndTheirShares = dbShares
                    .DistinctBy(p => new
                    {
                        p.SharedPostId,
                        p.SharedWithId
                    })
                    .GroupBy(u => u.SharedPost.User);

                if (!groupedUsersAndTheirShares.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Content shared with this mental health expert not available!");
                }

                List<SharesPerUserDto> sharesPerUser = await FillListGroupedUsersAndTheirShares(groupedUsersAndTheirShares);

                if (isSharedWithThisMentalHealthExpert && !sharesPerUser.Any())
                {
                    _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                    throw new RecordNotFoundException("Shares not fetched properly!");
                }

                _mentalExpertLoggerService.LogInformation($"SHARES-PER-USER: {MentalExpertServiceLogTypes.SUCCESS.ToString()}", sharesPerUser);
                return new Response(sharesPerUser, StatusCodes.Status200OK, MentalExpertServiceLogTypes.SUCCESS.ToString());

            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {e.Message}");
                throw;
            }
        }
        public async Task<Response> CreateAssignment(CreateAssignmentDto request)
        {
            try
            {
                if (!request.IsValid())
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString()}", request);
                    throw new ArgumentException("Bad request!");
                }

                var dbMentalHealthExpert = await _context.MentalHealthExperts
                        .FirstOrDefaultAsync(mhe => mhe.UserId == request.AssignmentGivenById);

                if (dbMentalHealthExpert == null)
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}", dbMentalHealthExpert);
                    throw new RecordNotFoundException("Couldn't create an assignment!");
                }

                var newAssignment = new Assignment(request.AssignmentGivenToId, dbMentalHealthExpert.Id, request.Content, DateTime.Now);

                if (newAssignment == null)
                {
                    _mentalExpertLoggerService.LogWarning($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.ASSIGNMENT_INVALID_DATA.ToString()}", newAssignment);
                    throw new CreateRecordException("Assignment can't be created!");
                }

                await _context.Assignments.AddAsync(newAssignment);
                await _context.SaveChangesAsync();

                _mentalExpertLoggerService.LogInformation($"GIVE-ASSIGNMENT: {MentalExpertServiceLogTypes.SUCCESS.ToString()}", newAssignment);
                return new Response(newAssignment, StatusCodes.Status201Created, MentalExpertServiceLogTypes.SUCCESS.ToString());
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"GIVE-ASSIGNMENT: {e.Message}");
                throw;
            }

        }
        private async Task<List<SharesPerUserDto>> FillListGroupedUsersAndTheirShares(IEnumerable<IGrouping<User, Share>> groupedUsersAndTheirShares)
        {
            try
            {
                List<SharesPerUserDto> sharesPerUser = new List<SharesPerUserDto>();
                ShareHelper shareHelper = new ShareHelper(_context);

                foreach (var userFromGroup in groupedUsersAndTheirShares)
                {
                    var dbUserByKey = await _context.Users.FindAsync(userFromGroup.Key.Id);
                    UserDto userThatSharedContent;

                    if (dbUserByKey is not null)
                    {
                        userThatSharedContent = new UserDto(dbUserByKey.Id, dbUserByKey.Username);
                        if (userThatSharedContent == null)
                        {
                            _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND}");
                            throw new RecordNotFoundException("User not found!");
                        }

                        List<PostDto> contentUserShared = await shareHelper.CallFillByUsersSharedContentForMentalHealthExpertPreviewAsync(userFromGroup, new List<PostDto>());

                        if (!contentUserShared.Any())
                        {
                            _mentalExpertLoggerService.LogWarning($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND.ToString()}");
                            throw new RecordNotFoundException("Shares aren't populated properly!");
                        }

                        sharesPerUser.Add(new SharesPerUserDto(userThatSharedContent, contentUserShared));
                        continue;
                    }

                    _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {MentalExpertServiceLogTypes.NOT_FOUND}");
                    throw new RecordNotFoundException("Couldn't populate the shares per user list! User not found.");
                }

                return sharesPerUser;
            }
            catch (Exception e)
            {
                _mentalExpertLoggerService.LogError($"SHARES-PER-USER: {e.Message}");
                throw;
            }
        }

    }
}

