namespace BusinessLogic.DTOs
{
    public class CardListDto
    {
        public int CardListId { get; set; }
        public string Name { get; set; }
        public int BoardId { get; set; }
        public virtual ICollection<CardDto> Cards { get; set; }
        public int CardCount => Cards?.Count ?? 0;
 
    }
}
