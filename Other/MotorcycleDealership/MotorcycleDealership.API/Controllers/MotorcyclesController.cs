using Microsoft.AspNetCore.Mvc;
using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using Microsoft.Extensions.Logging;

namespace MotorcycleDealership.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MotorcyclesController : ControllerBase
    {
        private readonly IRepository<Motorcycle> _motorcycleRepository;
        private readonly ILogger<MotorcyclesController> _logger;

        public MotorcyclesController(IRepository<Motorcycle> motorcycleRepository, ILogger<MotorcyclesController> logger)
        {
            _motorcycleRepository = motorcycleRepository ?? throw new ArgumentNullException(nameof(motorcycleRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching all motorcycles");
            try
            {
                var motorcycles = await _motorcycleRepository.GetAllAsync(cancellationToken);
                var motorcycleList = await motorcycles.ToListAsync(cancellationToken);
                if (motorcycleList == null || !motorcycleList.Any())
                {
                    _logger.LogWarning("No motorcycles found in the database");
                    return NotFound(new { message = "No motorcycles available" });
                }
                return Ok(motorcycleList);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching motorcycles: {Message}", ex.Message);
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class TestDriveRequestsController : ControllerBase
    {
        private readonly IRepository<TestDriveRequest> _testDriveRepository;
        private readonly ILogger<TestDriveRequestsController> _logger;

        public TestDriveRequestsController(IRepository<TestDriveRequest> testDriveRepository, ILogger<TestDriveRequestsController> logger)
        {
            _testDriveRepository = testDriveRepository ?? throw new ArgumentNullException(nameof(testDriveRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TestDriveRequest request, CancellationToken cancellationToken)
        {
            if (request.RequestedDate < DateTime.Today.AddHours(9) || request.RequestedDate > DateTime.Today.AddHours(18))
            {
                return BadRequest(new { message = "Test drive must be scheduled between 9:00 AM and 6:00 PM." });
            }

            if (string.IsNullOrEmpty(request.Brand) || string.IsNullOrEmpty(request.Model))
            {
                return BadRequest(new { message = "Brand and Model are required." });
            }

            request.Id = Guid.NewGuid();
            await _testDriveRepository.AddAsync(request, cancellationToken);
            return Ok(new { message = "Test drive request submitted successfully.", id = request.Id });
        }
    }
}