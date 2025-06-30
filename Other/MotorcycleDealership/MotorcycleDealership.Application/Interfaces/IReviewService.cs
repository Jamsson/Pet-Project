using MotorcycleDealership.Domain.Entities;
namespace MotorcycleDealership.Application.Interfaces;
public interface IReviewService
{
    Task<Review> CreateAsync(Review review, string userId, CancellationToken cancellationToken);
    Task<IEnumerable<Review>> GetByMotorcycleIdAsync(Guid motorcycleId, CancellationToken cancellationToken);
}