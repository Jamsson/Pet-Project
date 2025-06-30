using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;
namespace MotorcycleDealership.Application.Services;
public class EventService : IEventService
{
    private readonly IRepository<Event> _eventRepository;

    public EventService(IRepository<Event> eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<Event> CreateAsync(Event eventItem, string userId, CancellationToken cancellationToken)
    {
        eventItem.Id = Guid.NewGuid();
        eventItem.UserId = userId;
        await _eventRepository.AddAsync(eventItem, cancellationToken);
        return eventItem;
    }

    public async Task<IEnumerable<Event>> GetByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _eventRepository.FindAsync(e => e.UserId == userId, cancellationToken);
    }
}