'use client';

import { useState, useEffect } from 'react';
import ExportButton from '@/components/export-button';
import { useKpis } from '@/hooks/use-kpis';
import { formatCurrency } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ReportsPage() {
  const { data: kpis } = useKpis();
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    if (kpis) {
      const revenue = kpis.find(k => k.title === "Ingresos Totales")?.value || 0;
      const expenses = kpis.find(k => k.title === "Gastos Totales")?.value || 0;
      const profit = kpis.find(k => k.title === "Utilidad Neta")?.value || 0;

      setReportData([
        { name: 'Ingresos', value: revenue, type: 'pos' },
        { name: 'Gastos', value: -expenses, type: 'neg' },
        { name: 'Utilidad', value: profit, type: 'total' },
      ]);
    }
  }, [kpis]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reportes Ejecutivos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Exporta informes y analiza el balance general.</p>
        </div>
        <ExportButton data={reportData} filename="reporte_ejecutivo" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-bold mb-8 text-slate-800 dark:text-white">Balance de Resultados (Waterfall)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val: number) => formatCurrency(val)} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {reportData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.type === 'pos' ? '#10b981' : entry.type === 'neg' ? '#ef4444' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
          <h4 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">Ingresos Operativos</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(reportData.find(d => d.name === 'Ingresos')?.value || 0)}
          </p>
        </div>
        <div className="p-6 bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20">
          <h4 className="text-rose-600 dark:text-rose-400 font-semibold mb-2">Gastos Totales</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(Math.abs(reportData.find(d => d.name === 'Gastos')?.value || 0))}
          </p>
        </div>
        <div className="p-6 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
          <h4 className="text-blue-600 dark:text-blue-400 font-semibold mb-2">Utilidad Bruta</h4>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(reportData.find(d => d.name === 'Utilidad')?.value || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
