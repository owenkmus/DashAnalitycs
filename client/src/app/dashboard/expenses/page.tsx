'use client';

import { useState, useEffect } from 'react';
import ExpensesBarChart from '@/components/charts/expenses-bar-chart';
import KpiDonutChart from '@/components/charts/kpi-donut-chart';
import DataTable from '@/components/data-table';
import apiClient from '@/lib/api-client';

export default function ExpensesPage() {
  const [expensesData, setExpensesData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      apiClient.get('/expenses'),
      apiClient.get('/transactions', { params: { limit: 50 } })
    ]).then(([expRes, transRes]) => {
      setExpensesData(expRes.data);
      setTransactions(transRes.data.items);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Análisis de Gastos</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Controla y categoriza los egresos de tu empresa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpensesBarChart data={expensesData} />
        <KpiDonutChart data={expensesData} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Desglose de Gastos</h2>
        <DataTable data={transactions.filter((t: any) => t.type === 'Expense')} isLoading={isLoading} />
      </div>
    </div>
  );
}
