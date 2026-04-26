using FinancialAnalytics.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinancialAnalytics.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KpiController : ControllerBase
    {
        private readonly IKpiService _kpiService;
        private readonly ILogger<KpiController> _logger;

        public KpiController(IKpiService kpiService, ILogger<KpiController> logger)
        {
            _kpiService = kpiService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetKpis()
        {
            try 
            {
                var kpis = await _kpiService.GetCurrentKpisAsync();
                return Ok(kpis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener KPIs");
                return StatusCode(500, ex.Message);
            }
        }
    }
}
