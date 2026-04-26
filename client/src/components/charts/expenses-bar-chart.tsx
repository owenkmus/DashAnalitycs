'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpensesBarChartProps {
  data: any[];
}

export default function ExpensesBarChart({ data }: ExpensesBarChartProps) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        label: 'Gastos por Categoría',
        data: data.map(d => d.amount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 12,
      }
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        }
      }
    }
  };

  return (
    <div className="h-[400px] w-full bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
      <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white">Gastos por Categoría</h3>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
