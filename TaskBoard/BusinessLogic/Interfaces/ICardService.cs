 
namespace BusinessLogic.Interfaces
{
    public interface ICardService<T>
    {
        Task<T> CreateCard(T t);
        Task DeleteCard(int id);
        Task<T> EditCard(int id, T t);
        Task<T> FetchCard(int id);
        Task<IEnumerable<T>> FetchAllCards();
    }
}
