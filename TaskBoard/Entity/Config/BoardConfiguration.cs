using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace Entities.Config
{
    public class BoardConfiguration : IEntityTypeConfiguration<Board>
    {
        public void Configure(EntityTypeBuilder<Board> builder)
        {
            builder.HasKey(c => c.BoardId);

            builder.HasMany(c => c.CardLists)
                   .WithOne(c => c.Board)
                   .HasForeignKey(c => c.BoardId);

            builder.HasData(
                new Board { BoardId = 1, Name = "Home Board" },
                new Board { BoardId = 2, Name = "Work Board" }
                );
        }
    }
}
