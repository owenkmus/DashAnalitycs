'use client';

import { CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
}

export default function DateRangePicker({ from, to, onFromChange, onToChange }: DateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
        <CalendarIcon size={16} className="text-slate-400" />
        <input 
          type="date" 
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="bg-transparent border-none text-sm text-slate-600 dark:text-slate-300 focus:ring-0 outline-none"
        />
      </div>
      <span className="text-slate-400 font-bold">→</span>
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
        <CalendarIcon size={16} className="text-slate-400" />
        <input 
          type="date" 
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="bg-transparent border-none text-sm text-slate-600 dark:text-slate-300 focus:ring-0 outline-none"
        />
      </div>
    </div>
  );
}
