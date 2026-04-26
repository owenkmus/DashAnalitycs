using FinancialAnalytics.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinancialAnalytics.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpensesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses([FromQuery] string? category)
        {
            var query = _context.Transactions.Where(t => t.Type == "Expense");

            if (!string.IsNullOrEmpty(category))
                query = query.Where(t => t.Category == category);

            // Fetch data first, then group and order in memory for SQLite compatibility
            var transactions = await query
                .Select(t => new { t.Category, t.Amount })
                .ToListAsync();

            var data = transactions
                .GroupBy(t => t.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(t => t.Amount)
                })
                .OrderByDescending(x => x.Amount)
                .ToList();

            return Ok(data);
        }
    }
}
