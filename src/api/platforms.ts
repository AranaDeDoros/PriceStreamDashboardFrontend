import { useQuery } from '@tanstack/react-query';
import api, { API_URL } from './client';
import type { Platform } from '../domain/api_contract';

const fetchAllPlatforms = async (): Promise<Platform[]> => {
  try {
    const response = await api.get(`${API_URL}/ingestion/platforms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all Platforms:', error);
    return [];
  }
};

export const useAllPlatforms = () => {
  return useQuery<Platform[], Error>({
    queryKey: ['allPlatforms'],
    queryFn: fetchAllPlatforms,
  });
};

