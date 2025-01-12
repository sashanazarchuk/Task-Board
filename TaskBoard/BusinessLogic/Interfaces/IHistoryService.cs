using BusinessLogic.DTOs;
 
namespace BusinessLogic.Interfaces
{
    public interface IHistoryService<T>
    {
        
        Task<IEnumerable<HistoryDto>> GetHistories(int boardId);
        Task LogHistory(T t);
    }
}
