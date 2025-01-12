using AutoMapper;
using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using Entities.Data;
using Entities.Enum;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class CardService : ICardService<CardDto>
    {
        private readonly AppDbContext context;
        private readonly IMapper mapper;
        private readonly IActivityService<ActivityDto> activityService;
        private readonly IHistoryService<HistoryDto> historyService;

        public CardService(AppDbContext context, IMapper mapper, IActivityService<ActivityDto> activityService, IHistoryService<HistoryDto> historyService)
        {
            this.context = context;
            this.mapper = mapper;
            this.activityService = activityService;
            this.historyService = historyService;
        }
        public async Task<CardDto> CreateCard(CardDto cardDto)
        {
            try
            {

                CardList cardList = await context.CardLists.FindAsync(cardDto.CardListId);

                if (cardList == null)
                    throw new Exception("CardList not found");


                var card = new Card
                {
                    Name = cardDto.Name,
                    Description = cardDto.Description,
                    Date = cardDto.Date,
                    Priority = cardDto.Priority,
                    CardList = cardList

                };

                context.Cards.Add(card);


                await context.SaveChangesAsync();

                await activityService.LogActivity(new ActivityDto
                {
                    Action = $"You created this card",
                    CardId = card.CardId,
                    Date = DateTime.UtcNow
                });

                await historyService.LogHistory(new HistoryDto
                {
                    Action = $"You created {cardDto.Name} card",
                    BoardId = card.CardList.BoardId,
                    Date = DateTime.UtcNow
                });
                return mapper.Map<CardDto>(card);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating card: {ex.Message}");
                throw;
            }
        }

        public async Task DeleteCard(int id)
        {
            try
            {
                var card = await context.Cards.FindAsync(id);

                if (card == null)
                    throw new Exception($"Card with id {id} not found");


                var cardName = card.Name;
                var cardListId = card.CardList?.BoardId;

                context.Cards.Remove(card);

                await context.SaveChangesAsync();


                if (cardListId != null)
                {
                    await historyService.LogHistory(new HistoryDto
                    {
                        Action = $"You deleted {cardName} card",
                        BoardId = cardListId.Value,
                        Date = DateTime.UtcNow
                    });
                }
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error deleting card with id {id}: {ex.Message}");
                throw;
            }
        }

        public async Task<CardDto> EditCard(int cardId, CardDto cardDto)
        {
            try
            {

                CardList newCardList = await context.CardLists.Include(cl => cl.Board).FirstOrDefaultAsync(x => x.CardListId == cardDto.CardListId);

                if (newCardList == null)
                    throw new Exception("CardList not found");

                var card = await context.Cards
                    .Include(c => c.CardList)
                    .FirstOrDefaultAsync(w => w.CardId == cardId);


                if (card == null)
                    throw new Exception($"Card with id {cardId} not found");


                if (card.CardList.Board.BoardId != newCardList.Board.BoardId)
                {
                    throw new Exception("Cannot move card to a list in a different board.");
                }


                var activityChanges = ActivityCardChange(card, cardDto);

                if (activityChanges.Any())
                {
                    foreach (var change in activityChanges)
                    {
                        await activityService.LogActivity(new ActivityDto
                        {
                            Action = change,
                            CardId = card.CardId,
                            Date = DateTime.UtcNow
                        });
                    }

                    var historyChanges = HistoryCardChange(card, cardDto);

                    if (historyChanges.Any())
                    {
                        foreach (var change in historyChanges)
                        {
                            await historyService.LogHistory(new HistoryDto
                            {
                                Action = change,
                                BoardId = card.CardList.BoardId,
                                Date = DateTime.UtcNow
                            });
                        }
                    }

                    card.Name = cardDto.Name;
                    card.Description = cardDto.Description;
                    card.Date = cardDto.Date;
                    card.Priority = cardDto.Priority;
                    card.CardList = newCardList;

                    await context.SaveChangesAsync();
                }

                return cardDto;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine($"Error editing card with id {cardId}: {ex.Message}");
                throw;
            }
        }

        public async Task<CardDto> FetchCard(int id)
        {
            try
            {
                var card = await context.Cards.Include(c => c.CardList).FirstOrDefaultAsync(c => c.CardId == id);

                if (card == null)
                    throw new Exception($"Card with id {id} not found");

                return mapper.Map<CardDto>(card);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching card with id {id}: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<CardDto>> FetchAllCards()
        {
            try
            {
                var card = await context.Cards.Include(c => c.CardList).ToListAsync();
                return mapper.Map<IEnumerable<CardDto>>(card);
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error fetching all cards: {ex.Message}");
                throw;
            }
        }

        private List<string> ActivityCardChange(Card card, CardDto cardDto)
        {
            var changes = new List<string>();

            if (card.Name != cardDto.Name)
                changes.Add($"You renamed this card from <p>{card.Name} to {cardDto.Name}</p>");


            if (card.Description != cardDto.Description)
                changes.Add($"You changed description");


            if (card.Priority != cardDto.Priority)
                changes.Add($"You changed priority from <p>{card.Priority} to {cardDto.Priority}</p>");


            if (card.Date != cardDto.Date)

                changes.Add($"You changed date from <p>{card.Date.ToString("ddd, d MMM")} to {cardDto.Date.ToString("ddd, d MMM")}</p>");

            if (card.CardListId != cardDto.CardListId)
            {
                var oldListName = context.CardLists.Where(l => l.CardListId == card.CardListId).Select(l => l.Name).FirstOrDefault();
                var newListName = context.CardLists.Where(l => l.CardListId == cardDto.CardListId).Select(l => l.Name).FirstOrDefault();

                changes.Add($"You changed status from <p>{oldListName} to {newListName} </p>");
            }

            return changes;
        }

        private List<string> HistoryCardChange(Card card, CardDto cardDto)
        {
            var changes = new List<string>();

            if (card.Name != cardDto.Name)
                changes.Add($"You renamed {card.Name} to {cardDto.Name}");


            if (card.Description != cardDto.Description)
                changes.Add($"You changed the description in {card.Name}");


            if (card.Priority != cardDto.Priority)
                changes.Add($"You changed the priority {card.Name} from {card.Priority} to {cardDto.Priority}");


            if (card.Date != cardDto.Date)
                changes.Add($"You changed the date {card.Name} from {card.Date.ToString("ddd, d MMM")} to {cardDto.Date.ToString("ddd, d MMM")}");


            if (card.CardListId != cardDto.CardListId)
            {
                var oldListName = context.CardLists.Where(l => l.CardListId == card.CardListId).Select(l => l.Name).FirstOrDefault();
                var newListName = context.CardLists.Where(l => l.CardListId == cardDto.CardListId).Select(l => l.Name).FirstOrDefault();

                changes.Add($"You moved {card.Name} from {oldListName} to {newListName}");
            }

            return changes;
        }



    }
}