import apiClient from '../../services/apiClient';
import type { ItemCreate, ItemResponse, GetItemsParams } from '../../types/index.ts';

export const fetchItemsApi = async (params?: GetItemsParams): Promise<ItemResponse[]> => {
  const response = await apiClient.get<ItemResponse[]>('/items/', { params });
  return response.data;
};

export const createItemApi = async (payload: ItemCreate): Promise<ItemResponse> => {
  const response = await apiClient.post<ItemResponse>('/items/', payload);
  return response.data;
};

export const deleteItemApi = async (id: number): Promise<ItemResponse> => {
  const response = await apiClient.delete<ItemResponse>(`/items/${id}`);
  return response.data;
};
