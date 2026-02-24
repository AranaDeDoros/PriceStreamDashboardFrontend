import { useQuery } from '@tanstack/react-query';
import api from './client';
import type { Run } from '../domain/api_contract';
const API_URL = import.meta.env.VITE_API_URL;

const fetchRunsByStatus = async (status: string): Promise<Run[]> => {
  try {
    const response = await api.get(`${API_URL}/ingestion/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching runs by status ${status}:`, error);
    return [];
  }
};

export const useRunsByStatus = (status: string) => {
  return useQuery<Run[], Error>({
    queryKey: ['runsByStatus', status],
    queryFn: () => fetchRunsByStatus(status),
    enabled: !!status,
  });
};
