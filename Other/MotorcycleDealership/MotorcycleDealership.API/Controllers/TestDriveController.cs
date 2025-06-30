using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace MotorcycleDealership.API.Controllers;

[Route("api/testdrive")]
[ApiController]
public class TestDriveController : ControllerBase
{
    private readonly ITestDriveService _testDriveService;
    private readonly IRepository<User> _userRepo;

    public TestDriveController(ITestDriveService testDriveService, IRepository<User> userRepo)
    {
        _testDriveService = testDriveService;
        _userRepo = userRepo;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTestDriveRequest(
        [FromBody][Required] TestDriveRequest request,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Извлекаем имя авторизованного пользователя
        var username = "1";

        // Получаем пользователя из базы по Username
        var user = await _userRepo.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return NotFound("User not found");

        // Привязываем Id пользователя, запрещая клиенту его подменять
        request.UserId = user.Id.ToString();

        // Проверка времени: только с 09:00 до 18:00
        var hour = request.RequestedDate.Hour;
        if (hour < 9 || hour >= 18)
            return BadRequest("Test drive must be scheduled between 9:00 AM and 6:00 PM.");

        // Генерация нового Id, если не задан
        if (request.Id == Guid.Empty)
            request.Id = Guid.NewGuid();

        try
        {
            var createdRequest = await _testDriveService.CreateAsync(request, user.Id, cancellationToken);
            return CreatedAtAction(nameof(CreateTestDriveRequest), new { id = createdRequest.Id }, new
            {
                message = "Test drive booked successfully!",
                data = createdRequest
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error creating test drive: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetTestDriveRequests(CancellationToken cancellationToken)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
            return Unauthorized("User not authenticated");

        var user = await _userRepo.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return NotFound("User not found");

        var requests = await _testDriveService.GetByUserIdAsync(user.Id, cancellationToken);
        return Ok(requests);
    }
}
