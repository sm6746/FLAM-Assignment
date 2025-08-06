import React from 'react';
import { Search, Wifi, WifiOff } from 'lucide-react';
import { Input } from '../ui/input';

interface FeedHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isOnline: boolean;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  searchQuery,
  onSearchChange,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Wifi className="h-4 w-4 text-retweet" />
                <span className="hidden sm:inline">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <WifiOff className="h-4 w-4" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};