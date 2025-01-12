

namespace BusinessLogic.Interfaces
{
    public interface IBoardService<T>
    {
        Task<T> FetchBoard(int id);
        Task<T> CreateBoard(T t);
        Task<T> EditBoard(int id, T t);
        Task DeleteBoard(int id);
        Task<IEnumerable<T>> FetchAllBoards();
    }
}
