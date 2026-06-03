/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import type { FileResponse } from '../../../types/index.ts';

interface FileUploadProps {
  onUploadSuccess: (file: FileResponse) => void;
  uploadedFiles: FileResponse[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  uploadedFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { uploadMutation, downloadMutation, deleteMutation } = useFileUpload();


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg('');
    // Max 10MB check
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10MB limit.');
      return;
    }

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        onUploadSuccess(data);
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.detail || 'Failed to upload file.');
      },
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = (fileId: number, filename: string) => {
    downloadMutation.mutate({ fileId, filename });
  };

  const handleDelete = (fileId: number) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteMutation.mutate(fileId, {
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.detail || 'Failed to delete file.');
        },
      });
    }
  };

  return (
    <div className="w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 shadow-xl transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">File Storage</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Upload and retrieve files securely using MinIO</p>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Drag & drop area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full py-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isDragActive
            ? 'border-purple-500 bg-purple-500/5'
            : 'border-gray-300 dark:border-gray-700 hover:border-purple-500/70 hover:bg-gray-50/50 dark:hover:bg-gray-950/20'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
        />
        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
          {uploadMutation.isPending ? (
            <span className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {uploadMutation.isPending ? 'Uploading file...' : 'Drag & drop your file here'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          or <span className="text-purple-600 dark:text-purple-400 font-semibold underline">browse file</span> (Max 10MB)
        </p>
      </div>

      {/* Session Uploads list */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            All Uploaded Files
          </h4>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {file.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {file.content_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDownload(file.id, file.filename)}
                    disabled={downloadMutation.isPending}
                    className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 text-gray-700 dark:text-gray-300 hover:text-purple-600 cursor-pointer transition-colors"
                    title="Download File"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 cursor-pointer disabled:opacity-50 transition-colors"
                    title="Delete File"
                  >
                    {deleteMutation.isPending ? (
                      <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <svg
                        className="w-4 h-4"
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
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
