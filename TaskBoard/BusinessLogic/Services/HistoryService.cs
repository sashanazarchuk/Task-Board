using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using Entities.Data;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class HistoryService : IHistoryService<HistoryDto>
    {
        private readonly AppDbContext context;


        public HistoryService(AppDbContext context)
        {
            this.context = context;

        }


        public async Task<IEnumerable<HistoryDto>> GetHistories(int boardId)
        {
            var histories = await context.Histories
            .Where(a => a.BoardId == boardId)
            .OrderByDescending(a => a.Date)
            .Take(20)
            .ToListAsync();

            return histories.Select(a => new HistoryDto
            {
                HistoryId = a.HistoryId,
                Action = a.Action,
                BoardId = a.BoardId,
                Date = a.Date
            }).ToList();
        }


        public async Task LogHistory(HistoryDto historyDto)
        {
            try
            {
                var history = new History
                {
                    Action = historyDto.Action,
                    BoardId = historyDto.BoardId,
                    Date = DateTime.UtcNow
                };

                context.Histories.Add(history);
                await context.SaveChangesAsync();

                var totalCount = await context.Histories.CountAsync();

                if (totalCount > 20)
                {
                    var oldestRecord = await context.Histories
                        .OrderBy(h => h.Date)
                        .FirstOrDefaultAsync();

                    if (oldestRecord != null)
                    {
                        context.Histories.Remove(oldestRecord);
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new ($"Error logging history: {ex.Message}");
               
            }
        }
    }
}
