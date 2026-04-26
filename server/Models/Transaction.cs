using System.ComponentModel.DataAnnotations;

namespace FinancialAnalytics.Server.Models
{
    public class Transaction
    {
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = "Revenue"; // Revenue o Expense

        public string Description { get; set; } = string.Empty;
    }
}
