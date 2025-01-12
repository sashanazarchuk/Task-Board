using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using Entities.Data;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class ActivityService : IActivityService<ActivityDto>
    {
        private readonly AppDbContext context;

        public ActivityService(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<IEnumerable<ActivityDto>> GetActivities(int cardId)
        {
            var activities = await context.Activities
            .Where(a => a.CardId == cardId)
            .OrderByDescending(a => a.Date)
            .Take(20)
            .ToListAsync();

            return activities.Select(a => new ActivityDto
            {
                ActivityId = a.ActivityId,
                Action = a.Action,
                CardId = a.CardId,
                Date = a.Date
            }).ToList();
        }

        public async Task LogActivity(ActivityDto activityDto)
        {
            try
            {
                var activity = new Activity
                {
                    Action = activityDto.Action,
                    CardId = activityDto.CardId,
                    Date = DateTime.UtcNow
                };

                context.Activities.Add(activity);
                await context.SaveChangesAsync();

                var totalCount = await context.Activities.CountAsync();

                if (totalCount > 20)
                {
                    var oldestRecord = await context.Activities
                            .OrderBy(h => h.Date)
                            .FirstOrDefaultAsync();

                    if (oldestRecord != null)
                    {
                        context.Activities.Remove(oldestRecord);
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new($"Error logging activity: {ex.Message}");
            }
        }


    }
}
