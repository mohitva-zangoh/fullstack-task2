import React from 'react';
import type { ItemResponse } from '../../../types/index.ts';

interface ItemListProps {
  items: ItemResponse[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  isDeletingId: number | null;
  search: string;
  onSearchChange: (value: string) => void;
  page: number;
  onPageChange: (newPage: number) => void;
  hasMore: boolean;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  isLoading,
  onDelete,
  isDeletingId,
  search,
  onSearchChange,
  page,
  onPageChange,
  hasMore,
}) => {
  return (
    <div className="w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Items</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage and browse through registered items</p>
        </div>
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">No items found</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mt-1">
            {search ? 'Try adjusting your search criteria.' : 'Get started by creating your first item.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white/70 dark:bg-gray-900/70 border border-gray-200/50 dark:border-gray-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {item.image_url ? (
                  <div className="h-40 overflow-hidden bg-gray-100 relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center text-purple-500/40">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                    {item.description || 'No description provided.'}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0 flex justify-end">
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={isDeletingId === item.id}
                  className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all duration-200"
                >
                  {isDeletingId === item.id ? (
                    <span className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-8 border-t border-gray-200/50 dark:border-gray-800/50 pt-4">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0 || isLoading}
          className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Page {page + 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasMore || isLoading}
          className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
