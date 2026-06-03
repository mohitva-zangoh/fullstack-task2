import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadFileApi, downloadFileApi, getFiles, deleteFileApi } from '../api';

export const useGetFiles = () => {
  return useQuery({
    queryKey: ['files'],
    queryFn: () => getFiles(),
  });
}


export const useFileUpload = () => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadFileApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ fileId, filename }: { fileId: number; filename: string }) => {
      const blob = await downloadFileApi(fileId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: number) => deleteFileApi(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  return {
    uploadMutation,
    downloadMutation,
    deleteMutation,
  };
};
