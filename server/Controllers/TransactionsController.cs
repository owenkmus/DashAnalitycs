using FinancialAnalytics.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancialAnalytics.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTransactions([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            // Simple approach for SQLite: fetch and slice in memory if needed, 
            // but Skip/Take should work fine in SQLite if the provider is good.
            // Let's keep it but add a try-catch.
            try 
            {
                var total = await _context.Transactions.CountAsync();
                var items = await _context.Transactions
                    .OrderByDescending(t => t.Date)
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .ToListAsync();

                return Ok(new
                {
                    Total = total,
                    Page = page,
                    Limit = limit,
                    Items = items
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
