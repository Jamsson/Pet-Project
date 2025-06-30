using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;

namespace MotorcycleDealership.Application.Services;
public class FavoriteService : IFavoriteService
{
    private readonly IRepository<Favorite> _favoriteRepository;

    public FavoriteService(IRepository<Favorite> favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task<Favorite> AddAsync(Favorite favorite, string userId, CancellationToken cancellationToken)
    {
        favorite.Id = Guid.NewGuid();
        favorite.UserId = userId;
        await _favoriteRepository.AddAsync(favorite, cancellationToken);
        return favorite;
    }

    public async Task<IEnumerable<Favorite>> GetByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _favoriteRepository.FindAsync(f => f.UserId == userId, cancellationToken);
    }

    public async Task RemoveAsync(Guid id, string userId, CancellationToken cancellationToken)
    {
        var favorite = await _favoriteRepository.FindAsync(f => f.Id == id && f.UserId == userId, cancellationToken);
        if (favorite.Any()) await _favoriteRepository.RemoveAsync(favorite.First(), cancellationToken); // Добавлен cancellationToken
    }
}