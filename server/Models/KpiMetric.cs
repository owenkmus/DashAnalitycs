namespace FinancialAnalytics.Server.Models
{
    public class KpiMetric
    {
        public string Title { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public double ChangePercentage { get; set; }
        public bool IsPositive { get; set; }
        public string Format { get; set; } = "currency"; // currency, percentage, number
    }
}
