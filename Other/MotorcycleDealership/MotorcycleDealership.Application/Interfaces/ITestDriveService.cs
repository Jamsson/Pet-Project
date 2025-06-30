using MotorcycleDealership.Domain.Entities;
namespace MotorcycleDealership.Application.Interfaces;
public interface ITestDriveService
{
    Task<TestDriveRequest> CreateAsync(TestDriveRequest request, string userId, CancellationToken cancellationToken);
    Task<IEnumerable<TestDriveRequest>> GetByUserIdAsync(string userId, CancellationToken cancellationToken);
}