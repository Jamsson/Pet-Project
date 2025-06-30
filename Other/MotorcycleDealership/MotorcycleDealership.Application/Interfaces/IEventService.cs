using MotorcycleDealership.Domain.Entities;
namespace MotorcycleDealership.Application.Interfaces;
public interface IEventService
{
    Task<Event> CreateAsync(Event eventItem, string userId, CancellationToken cancellationToken);
    Task<IEnumerable<Event>> GetByUserIdAsync(string userId, CancellationToken cancellationToken);
}