namespace MotorcycleDealership.Domain.Entities;
public class Favorite
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Guid MotorcycleId { get; set; }
}