'use client';

import { useKpis, KpiMetric } from '@/hooks/use-kpis';
import { useSignalR } from '@/hooks/use-signalr';
import KpiCard from '@/components/kpi-card';
import { useState, useEffect } from 'react';
import RevenueLineChart from '@/components/charts/revenue-line-chart';
import ExpensesBarChart from '@/components/charts/expenses-bar-chart';
import { useRevenue } from '@/hooks/use-revenue';
import apiClient from '@/lib/api-client';

export default function DashboardOverview() {
  const { data: initialKpis, isLoading: isLoadingKpis } = useKpis();
  const [liveKpis, setLiveKpis] = useState<KpiMetric[]>([]);
  const { data: revenueData } = useRevenue();
  const [expensesData, setExpensesData] = useState<any[]>([]);

  // Actualización vía SignalR
  useSignalR(
    process.env.NEXT_PUBLIC_SIGNALR_URL || 'http://localhost:5000/hubs/metrics',
    'ReceiveMetricsUpdate',
    (data) => {
      setLiveKpis(data);
    }
  );

  useEffect(() => {
    if (initialKpis) setLiveKpis(initialKpis);
  }, [initialKpis]);

  useEffect(() => {
    apiClient.get('/expenses').then(({ data }) => setExpensesData(data));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel de Control</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen en tiempo real de tu salud financiera.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {isLoadingKpis ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
          ))
        ) : (
          liveKpis.map((kpi, index) => (
            <KpiCard 
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.changePercentage}
              isPositive={kpi.isPositive}
              format={kpi.format}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueLineChart data={revenueData || []} />
        <ExpensesBarChart data={expensesData} />
      </div>
    </div>
  );
}
