using FinancialAnalytics.Server.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace FinancialAnalytics.Server.Services
{
    public class MetricsSimulator : BackgroundService
    {
        private readonly IHubContext<MetricsHub> _hubContext;
        private readonly IServiceProvider _serviceProvider;
        private readonly Random _random = new Random();

        public MetricsSimulator(IHubContext<MetricsHub> hubContext, IServiceProvider serviceProvider)
        {
            _hubContext = hubContext;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // Esperar 5 segundos entre actualizaciones
                await Task.Delay(5000, stoppingToken);

                using (var scope = _serviceProvider.CreateScope())
                {
                    var kpiService = scope.ServiceProvider.GetRequiredService<IKpiService>();
                    var metrics = await kpiService.GetCurrentKpisAsync();

                    // Simular una pequeña variación aleatoria para el "tiempo real"
                    foreach (var m in metrics)
                    {
                        var variation = (decimal)(_random.NextDouble() * 0.02 - 0.01); // +/- 1%
                        m.Value += m.Value * variation;
                    }

                    await _hubContext.Clients.All.SendAsync("ReceiveMetricsUpdate", metrics, stoppingToken);
                }
            }
        }
    }
}
