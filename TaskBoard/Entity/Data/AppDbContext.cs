using Entities.Config;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Entities.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new CardConfiguration());
            modelBuilder.ApplyConfiguration(new CardListConfiguration());
            modelBuilder.ApplyConfiguration(new BoardConfiguration());

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }

        public DbSet<CardList> CardLists { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<Board> Boards { get; set; }
    }
}