 

namespace BusinessLogic.DTOs
{
    public class BoardDto
    {
        public int BoardId { get; set; }
        public string Name { get; set; }
        public virtual ICollection<CardListDto> ListDtos { get; set; }
       
    }

     
}