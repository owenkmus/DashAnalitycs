import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface KpiMetric {
  title: string;
  value: number;
  changePercentage: number;
  isPositive: boolean;
  format: 'currency' | 'percentage' | 'number';
}

export const useKpis = () => {
  return useQuery<KpiMetric[]>({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data } = await apiClient.get('/kpi');
      return data;
    },
    refetchInterval: 30000, // Refetch cada 30s como fallback si SignalR falla
  });
};
