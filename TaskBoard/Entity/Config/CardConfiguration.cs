using Entities.Enum;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Reflection.Emit;

namespace Entities.Config
{
    public class CardConfiguration : IEntityTypeConfiguration<Card>
    {
        public void Configure(EntityTypeBuilder<Card> builder)
        {

            builder.HasKey(c => c.CardId);

            builder.HasOne(c => c.CardList)
                   .WithMany(c => c.Cards)
                   .HasForeignKey(c => c.CardListId);

            builder.HasData(
                 new Card
                 {
                     CardId = 1,
                     Name = "Prepare presentation",
                     Description = "Prepare a short project presentation for a meeting with the client.",
                     Date = new DateTime(2024, 5, 10).ToUniversalTime(),
                     Priority = CardPriority.High,
                     CardListId = 2,

                 },
                 new Card
                 {
                     CardId = 2,
                     Name = "Negotiate with supplier",
                     Description = "Organize a meeting with the supplier to discuss terms of delivery.",
                     Date = new DateTime(2024, 5, 10).ToUniversalTime(),
                     Priority = CardPriority.Low,
                     CardListId = 1,

                 },
                 new Card
                 {
                     CardId = 3,
                     Name = "Prepare monthly report",
                     Description = "Prepare a detailed report on the work done for the past month for management.",
                     Date = new DateTime(2024, 5, 10).ToUniversalTime(),
                     Priority = CardPriority.Medium,
                     CardListId = 3,

                 },
                 new Card
                 {
                     CardId = 4,
                     Name = "Organize corporate event",
                     Description = "Plan and organize a corporate event for company employees.",
                     Date = new DateTime(2024, 5, 10).ToUniversalTime(),
                     Priority = CardPriority.High,
                     CardListId = 3,

                 },
                 new Card
                 {
                     CardId = 5,
                     Name = "Prepare proposal for potential client",
                     Description = "Develop a proposal for collaboration to present to a potential client.",
                     Date = new DateTime(2024, 5, 10).ToUniversalTime(),
                     Priority = CardPriority.Low,
                     CardListId = 4

                 });
        }
    }
}
