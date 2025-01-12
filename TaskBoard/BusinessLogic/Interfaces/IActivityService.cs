
namespace BusinessLogic.Interfaces
{
    public interface IActivityService<T>
    {
        Task LogActivity(T activityDto);
        Task<IEnumerable<T>> GetActivities(int cardId);

    }
}
