using MotorcycleDealership.Domain.Entities;
using System.Threading;

namespace MotorcycleDealership.Application.Interfaces
{
    public interface IMotorcycleService
    {
        Task<IEnumerable<Motorcycle>> GetAllAsync(CancellationToken cancellationToken);
        Task<Motorcycle> GetByIdAsync(Guid id, CancellationToken cancellationToken); // Изменен тип id на Guid
        Task<Motorcycle> CreateAsync(CancellationToken cancellationToken, Motorcycle motorcycle);
        // Другие методы...
    }
}