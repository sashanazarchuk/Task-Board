namespace Entities.Models
{
    public class Activity
    {
        public int ActivityId { get; set; }
        public string Action { get; set; }
        public int CardId { get; set; }
        public DateTime Date { get; set; }
        public virtual Card Card { get; set; }

    }
}
