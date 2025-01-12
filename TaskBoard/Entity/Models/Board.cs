using System.ComponentModel.DataAnnotations;
 

namespace Entities.Models
{
    public class Board
    {
        [Key]
        public int BoardId { get; set; }
        public string Name { get; set; }
        public virtual List<CardList> CardLists { get; set; }

    }
}