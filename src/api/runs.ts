import { useQuery } from '@tanstack/react-query';
import api, { API_URL } from './client';
import type { Run } from '../domain/api_contract';

const fetchAllRuns = async (): Promise<Run[]> => {
  try {
    const response = await api.get(`${API_URL}/ingestion/runs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all runs:', error);
    return [];
  }
};

const fetchRunById = async (runId: string): Promise<Run> => {
  const response = await api.get(`${API_URL}/run/${runId}`);
  return response.data;
};

export const useAllRuns = () => {
  return useQuery<Run[], Error>({
    queryKey: ['allRuns'],
    queryFn: fetchAllRuns,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
};

export const useRunById = (runId: string) => {
  return useQuery<Run, Error>({
    queryKey: ['run', runId],
    queryFn: () => fetchRunById(runId),
    enabled: !!runId,
  });
};
