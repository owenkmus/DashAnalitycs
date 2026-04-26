using Microsoft.AspNetCore.SignalR;

namespace FinancialAnalytics.Server.Hubs
{
    public class MetricsHub : Hub
    {
        // Hub para actualizaciones en tiempo real
        public async Task SendMetricsUpdate(object metrics)
        {
            await Clients.All.SendAsync("ReceiveMetricsUpdate", metrics);
        }
    }
}
