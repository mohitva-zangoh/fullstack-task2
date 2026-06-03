import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchItemsApi, createItemApi, deleteItemApi } from '../api';
import type { ItemCreate } from '../../../types/index.ts';

export const useItems = (limit = 10) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0); // 0-indexed page for offset calculation
  const queryClient = useQueryClient();

  const queryKey = ['items', { search, page, limit }];

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey,
    queryFn: () => fetchItemsApi({ skip: page * limit, limit, search: search || undefined }),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ItemCreate) => createItemApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteItemApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  return {
    items,
    isLoading,
    isError,
    error,
    search,
    setSearch,
    page,
    setPage,
    createMutation,
    deleteMutation,
    isPlaceholderData,
  };
};
