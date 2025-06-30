using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;

namespace MotorcycleDealership.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;

    public EventsController(IEventService eventService)
    {
        _eventService = eventService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] Event eventItem, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var createdEvent = await _eventService.CreateAsync(eventItem, User.Identity!.Name!, cancellationToken);
        return CreatedAtAction(nameof(GetEvents), new { id = createdEvent.Id }, createdEvent);
    }

    [HttpGet]
    public async Task<IActionResult> GetEvents(CancellationToken cancellationToken)
    {
        var events = await _eventService.GetByUserIdAsync(User.Identity!.Name!, cancellationToken);
        return Ok(events);
    }
}