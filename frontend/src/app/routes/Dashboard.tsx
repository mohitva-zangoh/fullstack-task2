import React from 'react';
import { useAuthStore } from '../../stores';
import { FileUpload } from '../../features/file/components/FileUpload';
import { useGetFiles } from '../../features/file/hooks/useFileUpload';

export const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { data: allFiles = [] } = useGetFiles();

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 transition-all duration-300">
      {/* Welcome header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <span className="font-semibold text-purple-600 dark:text-purple-400">{user?.email}</span>. Manage your storage assets here.
          </p>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Uploads</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                {allFiles.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Storage Provider</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                MinIO Object Storage
              </h3>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Security Status</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                JWT Authenticated
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Component */}
      <div className="max-w-3xl">
        <FileUpload onUploadSuccess={() => {}} uploadedFiles={allFiles} />
      </div>
    </div>
  );
};

export default Dashboard;
