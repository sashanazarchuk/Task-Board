using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace TaskBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {

        private readonly ICardService<CardDto> service;

        public CardController(ICardService<CardDto> service)
        {
            this.service = service;
        }

        [HttpPost("CreateCard")]
        public async Task<IActionResult> CreateCard(CardDto cardDto)
        {
            try
            {
                var card = await service.CreateCard(cardDto);
                if (card == null)
                {
                    return BadRequest("Failed to create card.");
                }
                return Ok(card);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("RemoveCard/{id}")]
        public async Task<IActionResult> RemoveCard([FromRoute] int id)
        {
            try
            {
                await service.DeleteCard(id);
                return StatusCode(202);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPatch("EditItem/{id}")]
        public async Task<IActionResult> EditItem(int id, CardDto cardDto)
        {
            try
            {
                var card = await service.EditCard(id, cardDto);
                if (card == null)
                {
                    return BadRequest("Failed to edit card.");
                }
                return Ok(card);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("FetchCard/{id}")]
        public async Task<IActionResult> FetchCard(int id)
        {
            try
            {
                var card = await service.FetchCard(id);
                if (card == null)
                {
                    return BadRequest("Error fetching card.");
                }
                return Ok(card);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }


        [HttpGet("FetchAllCards")]
        public async Task<IActionResult> FetchAllCards()
        {
            try
            {
                var card = await service.FetchAllCards();
                return Ok(card);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }


    }
}
