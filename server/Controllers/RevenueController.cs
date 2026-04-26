using FinancialAnalytics.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancialAnalytics.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RevenueController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RevenueController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetRevenue([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var query = _context.Transactions.Where(t => t.Type == "Revenue");

            if (from.HasValue) query = query.Where(t => t.Date >= from.Value);
            if (to.HasValue) query = query.Where(t => t.Date <= to.Value);

            // Fetch data first, then group in memory for better SQLite compatibility
            var transactions = await query
                .Select(t => new { t.Date, t.Amount })
                .ToListAsync();

            var data = transactions
                .GroupBy(t => new { t.Date.Year, t.Date.Month })
                .Select(g => new
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderBy(x => x.Month)
                .ToList();

            return Ok(data);
        }
    }
}
