 

namespace BusinessLogic.Interfaces
{
    public interface ICardListService<T>
    {
        Task<T> CreateList(T t);
        Task<T> EditList(int id, T t);
        Task DeleteList(int id);
        Task<IEnumerable<T>> FetchAllCardList();
    }
}
