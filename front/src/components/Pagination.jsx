import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10 mb-12">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className="w-10 h-10 border border-[#0A0A0A] dark:border-[#F5F5F5] bg-white dark:bg-[#141414] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 font-mono">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 font-bold text-xs transition-all focus-ring ${
              currentPage === page
                ? 'bg-[#0A0A0A] text-white dark:bg-[#F5F5F5] dark:text-[#0A0A0A] border border-[#0A0A0A] dark:border-[#F5F5F5]'
                : 'bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-[#0A0A0A] dark:text-[#F5F5F5] hover:border-[#0A0A0A] dark:hover:border-[#F5F5F5]'
            }`}
          >
            {String(page).padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className="w-10 h-10 border border-[#0A0A0A] dark:border-[#F5F5F5] bg-white dark:bg-[#141414] text-[#0A0A0A] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-[#F5F5F5] dark:hover:text-[#0A0A0A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default Pagination;
