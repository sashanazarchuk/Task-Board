using BusinessLogic.DTOs;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace TaskBoard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : ControllerBase
    {
        private readonly IHistoryService<HistoryDto> _historyService;

        public HistoryController(IHistoryService<HistoryDto> historyService)
        {
            _historyService = historyService;
        }

        [HttpGet("{boardId}")]
        public async Task<ActionResult<IEnumerable<HistoryDto>>> GetHistory(int boardId)
        {
            try
            {
                var history = await _historyService.GetHistories(boardId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting history: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
