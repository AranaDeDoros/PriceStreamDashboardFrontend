import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import api, { API_URL } from './client';
import type { FailedTokenResponse, Token, TokenRequest } from '../domain/api_contract';

const login = async (req: TokenRequest): Promise<Token> => {
  const formData = new URLSearchParams();
  formData.append('username', req.username);
  formData.append('password', req.password);

  const response = await api.post(`${API_URL}/auth/token`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export const useLogin = () => {
  return useMutation<
    Token,
    AxiosError<FailedTokenResponse>,
    TokenRequest
  >({
    mutationKey: ['login'],
    mutationFn: login,
  });
};