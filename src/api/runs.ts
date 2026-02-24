import { useQuery } from '@tanstack/react-query';
import api from './client';
import type { Run } from '../domain/api_contract';

const API_URL = import.meta.env.VITE_API_URL;

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
  });
};

export const useRunById = (runId: string) => {
  return useQuery<Run, Error>({
    queryKey: ['run', runId],
    queryFn: () => fetchRunById(runId),
    enabled: !!runId,
  });
};
