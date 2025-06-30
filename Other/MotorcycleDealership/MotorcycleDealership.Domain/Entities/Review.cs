namespace MotorcycleDealership.Domain.Entities;
public class Review
{
    public Guid Id { get; set; }
    public Guid MotorcycleId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
}