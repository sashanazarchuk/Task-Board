using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Config
{
    public class CardListConfiguration : IEntityTypeConfiguration<CardList>
    {
        public void Configure(EntityTypeBuilder<CardList> builder)
        {
            builder.HasKey(c => c.CardListId);


            builder.HasMany(c => c.Cards)
                   .WithOne(c => c.CardList)
                   .HasForeignKey(c => c.CardListId);

            builder.HasOne(c => c.Board)
                    .WithMany(c => c.CardLists)
                    .HasForeignKey(c => c.BoardId);


            builder.HasData(
                new CardList { CardListId = 1, Name = "Planned", BoardId = 1 },
                new CardList { CardListId = 2, Name = "Completed", BoardId = 1 },

                new CardList { CardListId = 3, Name = "Planned", BoardId = 2 },
                new CardList { CardListId = 4, Name = "Completed", BoardId = 2 }
               );
        }
    }
}
