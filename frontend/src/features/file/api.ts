import apiClient from '../../services/apiClient';
import type { FileResponse } from '../../types/index.ts';

export const uploadFileApi = async (file: File): Promise<FileResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<FileResponse>('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getFiles = async (): Promise<FileResponse[]> => {
  const response = await apiClient.get<FileResponse[]>('/files/');
  return response.data;
};

export const downloadFileApi = async (fileId: number): Promise<Blob> => {
  const response = await apiClient.get<Blob>(`/files/${fileId}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteFileApi = async (fileId: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/files/${fileId}`);
  return response.data;
};
