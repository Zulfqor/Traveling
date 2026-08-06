import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/50 text-brand-orange flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10" strokeWidth={1.75} />
      </div>
      <h1 className="font-heading font-bold text-4xl text-brand-lightText dark:text-brand-darkText mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-base text-brand-mutedText max-w-md mb-8">
        The destination or hotel page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-heading font-semibold text-sm hover:bg-opacity-95 shadow-md transition-all focus-ring"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
        <span>Return to Hotels Search</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
