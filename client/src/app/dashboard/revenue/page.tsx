'use client';

import { useState, useEffect } from 'react';
import { useRevenue } from '@/hooks/use-revenue';
import RevenueLineChart from '@/components/charts/revenue-line-chart';
import DataTable from '@/components/data-table';
import DateRangePicker from '@/components/date-range-picker';
import ExportButton from '@/components/export-button';
import apiClient from '@/lib/api-client';

export default function RevenuePage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data: revenueData } = useRevenue(from, to);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiClient.get('/transactions', { params: { limit: 50 } })
      .then(({ data }) => setTransactions(data.items))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Análisis de Ingresos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitorea la entrada de capital en detalle.</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
          <ExportButton data={transactions} filename="ingresos_reporte" />
        </div>
      </div>

      <RevenueLineChart data={revenueData || []} />

      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Últimas Transacciones de Ingresos</h2>
        <DataTable data={transactions.filter((t: any) => t.type === 'Revenue')} isLoading={isLoading} />
      </div>
    </div>
  );
}
