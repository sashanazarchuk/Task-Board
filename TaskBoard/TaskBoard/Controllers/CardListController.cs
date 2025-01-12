using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;

namespace TaskBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardListController : ControllerBase
    {

        private readonly ICardListService<CardListDto> service;

        public CardListController(ICardListService<CardListDto> service)
        {
            this.service = service;
        }

        [HttpPost("CreateList")]
        public async Task<IActionResult> CreateList(CardListDto listDto)
        {
            try
            {
                var list = await service.CreateList(listDto);
                if (list == null)
                {
                    return BadRequest("Failed to create list.");
                }
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPatch("EditList/{id}")]
        public async Task<IActionResult> EditList(int id, CardListDto listDto)
        {
            try
            {
                var list = await service.EditList(id, listDto);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("RemoveList/{id}")]
        public async Task<IActionResult> RemoveList(int id)
        {
            try
            {
                await service.DeleteList(id);
                return StatusCode(204);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("FetchAllCardLists")]
        public async Task<IActionResult> FetchAllCardLists()
        {
            try
            {
                return Ok(await service.FetchAllCardList());
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
