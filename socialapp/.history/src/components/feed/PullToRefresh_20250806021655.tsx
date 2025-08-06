import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  isRefreshing: boolean;
  onRefresh: () => void;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  isRefreshing,
  onRefresh,
  disabled = false,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  const threshold = 60; // Pixels to pull before triggering refresh

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const scrollTop = e.currentTarget.scrollTop;
    
    // Only allow pull to refresh when at the top
    if (scrollTop === 0 && currentY.current > startY.current) {
      const distance = Math.min(currentY.current - startY.current, threshold * 1.5);
      setPullDistance(distance);
      setIsPulling(distance > 20);
      
      // Prevent default scrolling when pulling
      if (distance > 0) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (disabled || isRefreshing) return;
    
    if (pullDistance >= threshold) {
      onRefresh();
    }
    
    setIsPulling(false);
    setPullDistance(0);
  };

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 ease-out ${
          isPulling || isRefreshing ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          height: Math.max(pullDistance, isRefreshing ? 60 : 0),
          background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))',
        }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw
            className={`h-4 w-4 transition-transform duration-200 ${
              isRefreshing
                ? 'animate-spin'
                : shouldTrigger
                ? 'rotate-180'
                : ''
            }`}
            style={{
              transform: `rotate(${refreshProgress * 180}deg)`,
            }}
          />
          <span>
            {isRefreshing
              ? 'Refreshing...'
              : shouldTrigger
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${isPulling ? pullDistance : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};