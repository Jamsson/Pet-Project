using MotorcycleDealership.Domain.Entities;
namespace MotorcycleDealership.Application.Interfaces;
public interface IFavoriteService
{
    Task<Favorite> AddAsync(Favorite favorite, string userId, CancellationToken cancellationToken);
    Task<IEnumerable<Favorite>> GetByUserIdAsync(string userId, CancellationToken cancellationToken);
    Task RemoveAsync(Guid id, string userId, CancellationToken cancellationToken);
}