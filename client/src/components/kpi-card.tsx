'use client';

import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: number;
  change: number;
  isPositive: boolean;
  format: 'currency' | 'percentage' | 'number';
}

export default function KpiCard({ title, value, change, isPositive, format }: KpiCardProps) {
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : format === 'percentage' 
      ? formatPercentage(value) 
      : value.toLocaleString();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</h3>
        <div className={cn(
          "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
          isPositive 
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" 
            : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
        )}>
          {isPositive ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">
        {formattedValue}
      </div>
    </motion.div>
  );
}
