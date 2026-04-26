import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface RevenueData {
  month: string;
  amount: number;
}

export const useRevenue = (from?: string, to?: string) => {
  return useQuery<RevenueData[]>({
    queryKey: ['revenue', from, to],
    queryFn: async () => {
      const { data } = await apiClient.get('/revenue', {
        params: { from, to },
      });
      return data;
    },
  });
};
