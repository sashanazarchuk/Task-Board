using Entities.Enum;

namespace BusinessLogic.DTOs
{
    public class CardDto
    {
        public int CardId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public CardPriority Priority { get; set; }
 
        public int? CardListId { get; set; }
 

    }
}
