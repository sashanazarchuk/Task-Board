using Entities.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models
{
    public class Card
    {
        [Key]
        public int CardId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public CardPriority Priority { get; set; }


        [ForeignKey("CardListId")]
        public int CardListId { get; set; }
        public virtual CardList CardList { get; set; }
    }
}
