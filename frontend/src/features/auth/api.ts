import apiClient from '../../services/apiClient';
import type { LoginPayload, RegisterPayload, AuthResponse, UserResponse } from '../../types/index.ts';

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/users/login', payload);
  return response.data;
};

export const registerApi = async (payload: RegisterPayload): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>('/users/register', payload);
  return response.data;
};

export const getMeApi = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/users/me');
  return response.data;
};
