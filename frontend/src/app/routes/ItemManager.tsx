/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useItems } from '../../features/item/hooks/useItems';
import { ItemForm } from '../../features/item/components/ItemForm';
import { ItemList } from '../../features/item/components/ItemList';
import type { ItemCreate } from '../../types/index.ts';

export const ItemManager: React.FC = () => {
  const limit = 6; // Limit items per page
  const {
    items,
    isLoading,
    search,
    setSearch,
    page,
    setPage,
    createMutation,
    deleteMutation,
  } = useItems(limit);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleCreateSubmit = (data: ItemCreate) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        // Reset to first page so user sees new item
        setPage(0);
      },
      onError: (err: any) => {
        alert(err.response?.data?.detail || 'Failed to create item.');
      },
    });
  };

  const handleDeleteItem = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeletingId(null);
      },
      onError: (err: any) => {
        setDeletingId(null);
        alert(err.response?.data?.detail || 'Failed to delete item.');
      },
    });
  };

  // Determine if there might be more items (if we received a full page)
  const hasMore = items.length === limit;

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 transition-all duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Item Manager
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Perform CRUD operations, filter collection records, and view lists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ItemForm
              onSubmit={handleCreateSubmit}
              isSubmitting={createMutation.isPending}
            />
          </div>
        </div>

        {/* Right side: List */}
        <div className="lg:col-span-2">
          <ItemList
            items={items}
            isLoading={isLoading}
            onDelete={handleDeleteItem}
            isDeletingId={deletingId}
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(0); // Reset page to 0 on search input change
            }}
            page={page}
            onPageChange={setPage}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemManager;
