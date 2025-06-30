using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;
namespace MotorcycleDealership.Application.Services;
public class TestDriveService : ITestDriveService
{
    private readonly IRepository<TestDriveRequest> _testDriveRepository;

    public TestDriveService(IRepository<TestDriveRequest> testDriveRepository)
    {
        _testDriveRepository = testDriveRepository;
    }

    public async Task<TestDriveRequest> CreateAsync(TestDriveRequest request, string userId, CancellationToken cancellationToken)
    {
        request.Id = Guid.NewGuid();
        request.UserId = userId;
        request.Status = "Pending";
        await _testDriveRepository.AddAsync(request, cancellationToken);
        return request;
    }

    public async Task<IEnumerable<TestDriveRequest>> GetByUserIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _testDriveRepository.FindAsync(r => r.UserId == userId, cancellationToken);
    }
}