'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboardIcon, 
  TrendingUpIcon, 
  CreditCardIcon, 
  FileTextIcon,
  LogOutIcon,
  TrendingDownIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboardIcon, href: '/dashboard' },
  { name: 'Ingresos', icon: TrendingUpIcon, href: '/dashboard/revenue' },
  { name: 'Gastos', icon: TrendingDownIcon, href: '/dashboard/expenses' },
  { name: 'Reportes', icon: FileTextIcon, href: '/dashboard/reports' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <TrendingUpIcon size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">FinTrace</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform group-hover:scale-110",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
              )} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 rounded-xl transition-all"
        >
          <LogOutIcon size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
