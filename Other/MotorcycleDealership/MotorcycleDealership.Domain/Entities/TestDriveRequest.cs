using System.ComponentModel.DataAnnotations;

namespace MotorcycleDealership.Domain.Entities
{
    public class TestDriveRequest
    {
        public Guid Id { get; set; }
        public string? UserId { get; set; }
        [Required] public string Brand { get; set; } = null!;
        [Required] public string Model { get; set; } = null!;
        [Required] public DateTime RequestedDate { get; set; }
        public string Status { get; set; } = "Pending";
    }
}