using FinancialAnalytics.Server.Data;
using FinancialAnalytics.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FinancialAnalytics.Server.Services
{
    public interface IKpiService
    {
        Task<List<KpiMetric>> GetCurrentKpisAsync();
    }

    public class KpiService : IKpiService
    {
        private readonly AppDbContext _context;

        public KpiService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<KpiMetric>> GetCurrentKpisAsync()
        {
            var now = DateTime.Now;
            var currentMonthDate = new DateTime(now.Year, now.Month, 1);
            var lastMonthDate = currentMonthDate.AddMonths(-1);

            // Fetching more data and filtering in memory to ensure SQLite compatibility
            var allTransactions = await _context.Transactions.ToListAsync();

            var filteredTransactions = allTransactions
                .Where(t => t.Date >= lastMonthDate)
                .ToList();

            var currentMonthTransactions = filteredTransactions.Where(t => t.Date >= currentMonthDate).ToList();
            var lastMonthTransactions = filteredTransactions.Where(t => t.Date < currentMonthDate).ToList();

            var currentRevenue = currentMonthTransactions.Where(t => t.Type == "Revenue").Sum(t => t.Amount);
            var lastRevenue = lastMonthTransactions.Where(t => t.Type == "Revenue").Sum(t => t.Amount);

            var currentExpenses = currentMonthTransactions.Where(t => t.Type == "Expense").Sum(t => t.Amount);
            var lastExpenses = lastMonthTransactions.Where(t => t.Type == "Expense").Sum(t => t.Amount);

            var currentProfit = currentRevenue - currentExpenses;
            var lastProfit = lastRevenue - lastExpenses;

            return new List<KpiMetric>
            {
                new KpiMetric { 
                    Title = "Ingresos Totales", 
                    Value = currentRevenue, 
                    ChangePercentage = (double)CalculateChange(currentRevenue, lastRevenue),
                    IsPositive = currentRevenue >= lastRevenue,
                    Format = "currency"
                },
                new KpiMetric { 
                    Title = "Gastos Totales", 
                    Value = currentExpenses, 
                    ChangePercentage = (double)CalculateChange(currentExpenses, lastExpenses),
                    IsPositive = currentExpenses <= lastExpenses,
                    Format = "currency"
                },
                new KpiMetric { 
                    Title = "Utilidad Neta", 
                    Value = currentProfit, 
                    ChangePercentage = (double)CalculateChange(currentProfit, lastProfit),
                    IsPositive = currentProfit >= lastProfit,
                    Format = "currency"
                },
                new KpiMetric { 
                    Title = "Margen %", 
                    Value = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0, 
                    ChangePercentage = 0, 
                    IsPositive = true,
                    Format = "percentage"
                },
                new KpiMetric { 
                    Title = "Transacciones", 
                    Value = (decimal)currentMonthTransactions.Count, 
                    ChangePercentage = CalculateChange(currentMonthTransactions.Count, lastMonthTransactions.Count),
                    IsPositive = currentMonthTransactions.Count >= lastMonthTransactions.Count,
                    Format = "number"
                },
                new KpiMetric { 
                    Title = "Crecimiento", 
                    Value = CalculateChange(currentRevenue, lastRevenue), 
                    ChangePercentage = 0,
                    IsPositive = currentRevenue >= lastRevenue,
                    Format = "percentage"
                }
            };
        }

        private decimal CalculateChange(decimal current, decimal last)
        {
            if (last == 0) return current > 0 ? 100 : 0;
            return ((current - last) / last) * 100;
        }

        private double CalculateChange(int current, int last)
        {
            if (last == 0) return current > 0 ? 100 : 0;
            return (double)(current - last) / last * 100;
        }
    }
}
