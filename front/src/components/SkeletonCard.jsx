import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-[#1B1F26] border border-[#E7E5DF] dark:border-slate-800 rounded-card p-0 flex flex-col justify-between h-full overflow-hidden">
      <div>
        {/* Photo Skeleton */}
        <div className="w-full h-52 sm:h-56 skeleton-shimmer" />
        
        {/* Perforation Divider */}
        <div className="ticket-perforation-wrapper">
          <div className="ticket-notch-left" />
          <div className="ticket-divider" />
          <div className="ticket-notch-right" />
        </div>

        {/* Content Skeleton */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 skeleton-shimmer rounded-md w-3/5" />
            <div className="h-4 skeleton-shimmer rounded-md w-1/5" />
          </div>
          <div className="h-4 skeleton-shimmer rounded-md w-2/5" />
          <div className="h-7 skeleton-shimmer rounded-md w-1/3 mt-2" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="p-5 pt-0">
        <div className="h-12 skeleton-shimmer rounded-xl w-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
