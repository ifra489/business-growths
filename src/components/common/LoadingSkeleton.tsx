import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'chart' | 'table' | 'full';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const renderItem = (index: number) => {
    if (type === 'text') {
      return (
        <div key={index} className="space-y-2 animate-pulse my-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-5/6"></div>
        </div>
      );
    }

    if (type === 'chart') {
      return (
        <div key={index} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-200 dark:bg-slate-700/60 rounded w-1/3"></div>
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700/60"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between h-4">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                  <div className="w-8 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
                </div>
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700/60 rounded-full w-full"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-4"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700/60 shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-1/2"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-1/3"></div>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3.5 bg-slate-200 dark:bg-slate-700/60 rounded w-full"></div>
          <div className="h-3.5 bg-slate-200 dark:bg-slate-700/60 rounded w-4/5"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => renderItem(i))}
    </div>
  );
};
