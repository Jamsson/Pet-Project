using System.ComponentModel.DataAnnotations;

namespace MotorcycleDealership.Domain.Entities
{
    public class User
    {
        public string? Id { get; set; }
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = null!;
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = null!;
    }
}