 

namespace BusinessLogic.DTOs
{
    public class HistoryDto
    {
        public int HistoryId { get; set; }
        public string Action { get; set; }
        public int BoardId { get; set; }
        public DateTime Date { get; set; }
    }
}
