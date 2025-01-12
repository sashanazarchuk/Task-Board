using AutoMapper;
using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using Entities.Data;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class CardListService : ICardListService<CardListDto>
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper;
        private readonly IHistoryService<HistoryDto> historyService;

        public CardListService(AppDbContext context, IMapper mapper, IHistoryService<HistoryDto> historyService)
        {
            this.context = context;
            this.mapper = mapper;
            this.historyService = historyService;
        }

        public async Task<CardListDto> CreateList(CardListDto listDto)
        {
            try
            {
                var list = new CardList
                {
                    Name = listDto.Name,
                    BoardId = listDto.BoardId
                };

                context.CardLists.Add(list);
                await context.SaveChangesAsync();

                await historyService.LogHistory(new HistoryDto
                {
                    Action = $"You created {list.Name} list",
                    BoardId = list.BoardId,
                    Date = DateTime.UtcNow
                });

                return mapper.Map<CardListDto>(list);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating list: {ex.Message}");
                throw;
            }
        }

        public async Task DeleteList(int id)
        {
            try
            {
                var list = await context.CardLists.FindAsync(id);

                if (list == null)
                    throw new Exception($"List with id {id} not found");

                var listName = list.Name;
                int? cardListId = list.BoardId;

                context.CardLists.Remove(list);
                await context.SaveChangesAsync();

                if (cardListId != null)
                {
                    await historyService.LogHistory(new HistoryDto
                    {
                        Action = $"You deleted {listName} list",
                        BoardId = cardListId.Value,
                        Date = DateTime.UtcNow
                    });
                }

            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error deleting list with id {id}: {ex.Message}");
                throw;
            }
        }

        public async Task<CardListDto> EditList(int listId, CardListDto listDto)
        {
            try
            {
                var list = await context.CardLists.FirstOrDefaultAsync(w => w.CardListId == listId);

                if (list == null)
                    throw new Exception($"List with id {listId} not found");

                var historyChanges = HistoryListChange(list, listDto);

                if (historyChanges.Any())
                {
                    foreach (var change in historyChanges)
                    {
                        await historyService.LogHistory(new HistoryDto
                        {
                            Action = change,
                            BoardId = list.BoardId,
                            Date = DateTime.UtcNow
                        });
                    }
                }


                list.Name = listDto.Name;


                await context.SaveChangesAsync();

                return listDto;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine($"Error editing list with id {listId}: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<CardListDto>> FetchAllCardList()
        {
            try
            {
                var list = await context.CardLists.ToListAsync();
                return mapper.Map<IEnumerable<CardListDto>>(list);
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error fetching all lists: {ex.Message}");
                throw;
            }
        }

        private List<string> HistoryListChange(CardList list, CardListDto listDto)
        {
            var changes = new List<string>();

            if (list.Name != listDto.Name)
                changes.Add($"You renamed list {list.Name} to {listDto.Name}");
            return changes;
        }
    }
}
