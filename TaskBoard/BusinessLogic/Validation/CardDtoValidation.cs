using BusinessLogic.DTOs;
using Entities.Enum;
using FluentValidation;

namespace BusinessLogic.Validation
{

    public class CardDtoValidation : AbstractValidator<CardDto>
    {
        public CardDtoValidation()
        {

            RuleFor(x => x.Priority)
            .Must(p => Enum.IsDefined(typeof(CardPriority), p))
            .WithMessage("Invalid priority value.");
        }




    }
}
