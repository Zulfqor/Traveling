import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorState = ({ message = 'Failed to load hotels. Please make sure backend is running.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-brand-darkCard border border-gray-200 dark:border-slate-800 rounded-card shadow-sm max-w-md mx-auto my-12 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/60 text-red-500 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" strokeWidth={1.75} />
      </div>
      <h3 className="font-heading font-bold text-xl text-brand-lightText dark:text-brand-darkText mb-2">
        Something Went Wrong
      </h3>
      <p className="text-sm text-brand-mutedText mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl font-medium text-sm hover:bg-opacity-95 shadow-sm transition-all focus-ring"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
