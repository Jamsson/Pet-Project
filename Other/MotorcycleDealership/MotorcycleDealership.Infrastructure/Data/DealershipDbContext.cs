using Microsoft.EntityFrameworkCore;
using MotorcycleDealership.Domain.Entities;

namespace MotorcycleDealership.Infrastructure.Data
{
    public class DealershipDbContext : DbContext
    {
        public DealershipDbContext(DbContextOptions<DealershipDbContext> options)
            : base(options)
        {
        }

        public DbSet<Motorcycle> Motorcycles { get; set; }
        public DbSet<TestDriveRequest> TestDriveRequests { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Motorcycle>(entity =>
            {
                entity.Property(e => e.Id).HasColumnType("uuid").ValueGeneratedNever();
            });
            modelBuilder.Entity<TestDriveRequest>(entity =>
            {
                entity.Property(e => e.Brand).IsRequired();
                entity.Property(e => e.Model).IsRequired();
            });
        }
    }
}