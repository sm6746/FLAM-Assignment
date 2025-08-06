import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '../ui/button';

interface FeedErrorProps {
  message: string;
  onRetry: () => void;
  isOnline: boolean;
}

export const FeedError: React.FC<FeedErrorProps> = ({
  message,
  onRetry,
  isOnline,
}) => {
  const isNetworkError = !isOnline;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4">
        {isNetworkError ? (
          <WifiOff className="h-12 w-12 text-destructive" />
        ) : (
          <AlertTriangle className="h-12 w-12 text-destructive" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        {isNetworkError ? 'No Internet Connection' : 'Something went wrong'}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {isNetworkError 
          ? 'Please check your internet connection and try again.'
          : message
        }
      </p>
      
      <Button 
        onClick={onRetry}
        disabled={isNetworkError}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
      
      {isNetworkError && (
        <p className="text-xs text-muted-foreground mt-4">
          You'll be able to retry when you're back online
        </p>
      )}
    </div>
  );
};