'use client';

import { formatDate, formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface DataTableProps {
  data: any[];
  isLoading?: boolean;
}

export default function DataTable({ data, isLoading }: DataTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Fecha</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Descripción</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Categoría</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Tipo</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{formatDate(item.date)}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{item.description}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={cn(
                    "px-2 py-1 rounded-md text-xs font-bold uppercase",
                    item.type === 'Revenue' 
                      ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" 
                      : "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10"
                  )}>
                    {item.type}
                  </span>
                </td>
                <td className={cn(
                  "px-6 py-4 text-sm font-bold text-right",
                  item.type === 'Revenue' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                )}>
                  {item.type === 'Revenue' ? '+' : '-'}{formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
