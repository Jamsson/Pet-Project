namespace MotorcycleDealership.Domain.Entities;
public class Event
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Guid? MotorcycleId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Type { get; set; } = "TestDrive";
}