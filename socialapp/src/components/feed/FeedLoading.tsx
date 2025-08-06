import React from 'react';
import { LoadingSpinner } from '../ui/loading-spinner';

export const FeedLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">Loading your feed...</p>
    </div>
  );
};