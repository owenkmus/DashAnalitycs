using Microsoft.AspNetCore.Identity;

namespace FinancialAnalytics.Server.Models
{
    public class User : IdentityUser
    {
        public string? FullName { get; set; }
    }
}
