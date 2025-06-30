using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;
using System.Threading;

namespace MotorcycleDealership.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IRepository<Review> _reviewRepository;

        public ReviewService(IRepository<Review> reviewRepository)
        {
            _reviewRepository = reviewRepository ?? throw new ArgumentNullException(nameof(reviewRepository));
        }

        public async Task<Review> CreateAsync(Review review, string userId, CancellationToken cancellationToken)
        {
            if (review == null) throw new ArgumentNullException(nameof(review));
            review.Id = Guid.NewGuid();
            review.UserId = userId ?? throw new ArgumentNullException(nameof(userId));

            try
            {
                await _reviewRepository.AddAsync(review, cancellationToken);
                return review; // Предполагаем, что AddAsync сохраняет объект
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to create review.", ex);
            }
        }

        public async Task<IEnumerable<Review>> GetByMotorcycleIdAsync(Guid motorcycleId, CancellationToken cancellationToken)
        {
            try
            {
                return await _reviewRepository.FindAsync(r => r.MotorcycleId == motorcycleId, cancellationToken) 
                       ?? Enumerable.Empty<Review>();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to retrieve reviews.", ex);
            }
        }
    }
}