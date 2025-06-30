using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;
using System.Threading;

namespace MotorcycleDealership.Application.Services
{
    public class MotorcycleService : IMotorcycleService
    {
        private readonly IRepository<Motorcycle> _motorcycleRepository;

        public MotorcycleService(IRepository<Motorcycle> motorcycleRepository)
        {
            _motorcycleRepository = motorcycleRepository;
        }

        public async Task<IEnumerable<Motorcycle>> GetAllAsync(CancellationToken cancellationToken)
        {
            return await _motorcycleRepository.GetAllAsync(cancellationToken);
        }

        public async Task<Motorcycle> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var motorcycles = await _motorcycleRepository.FindAsync(m => m.Id == id, cancellationToken);
            return motorcycles.FirstOrDefault() ?? throw new InvalidOperationException("Motorcycle not found");
        }

        public async Task<Motorcycle> CreateAsync(CancellationToken cancellationToken, Motorcycle motorcycle)
        {
            motorcycle.Id = Guid.NewGuid(); // Генерация нового Guid
            await _motorcycleRepository.AddAsync(motorcycle, cancellationToken);
            return motorcycle;
        }
    }
}