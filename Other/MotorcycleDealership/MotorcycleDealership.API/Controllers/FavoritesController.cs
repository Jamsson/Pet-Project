using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;

namespace MotorcycleDealership.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] Favorite favorite, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var addedFavorite = await _favoriteService.AddAsync(favorite, User.Identity!.Name!, cancellationToken);
        return CreatedAtAction(nameof(GetFavorites), new { id = addedFavorite.Id }, addedFavorite);
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites(CancellationToken cancellationToken)
    {
        var favorites = await _favoriteService.GetByUserIdAsync(User.Identity!.Name!, cancellationToken);
        return Ok(favorites);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFavorite(Guid id, CancellationToken cancellationToken)
    {
        await _favoriteService.RemoveAsync(id, User.Identity!.Name!, cancellationToken);
        return NoContent();
    }
}