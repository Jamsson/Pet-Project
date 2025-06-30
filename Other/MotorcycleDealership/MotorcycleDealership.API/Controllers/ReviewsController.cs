using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;

namespace MotorcycleDealership.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly IRepository<User> _userRepo;
    private readonly ILogger<ReviewsController> _logger;

    public ReviewsController(
        IReviewService reviewService,
        IRepository<User> userRepo,
        ILogger<ReviewsController> logger)
    {
        _reviewService = reviewService ?? throw new ArgumentNullException(nameof(reviewService));
        _userRepo = userRepo ?? throw new ArgumentNullException(nameof(userRepo));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] Review review, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            string? username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated");

            var user = await _userRepo.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return NotFound("User not found in application database");

            review.UserId = user.Id;

            var createdReview = await _reviewService.CreateAsync(review, user.Id, cancellationToken);
            _logger.LogInformation("Review created successfully for user {UserId} with ID {ReviewId}", user.Id, createdReview.Id);
            return CreatedAtAction(nameof(GetReviews), new { id = createdReview.Id }, createdReview);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating review for user {UserName}", User?.Identity?.Name);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{motorcycleId}")]
    public async Task<IActionResult> GetReviews(Guid motorcycleId, CancellationToken cancellationToken)
    {
        try
        {
            var reviews = await _reviewService.GetByMotorcycleIdAsync(motorcycleId, cancellationToken);
            _logger.LogInformation("Retrieved {Count} reviews for motorcycle {MotorcycleId}", reviews.Count(), motorcycleId);
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reviews for motorcycle {MotorcycleId}", motorcycleId);
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
