

import React, { useState, useRef } from 'react';
import { useMusicPlayer } from '@//contexts/MusicPlayerContext';

export function ProgressBar() {
  const { progress, seek } = useMusicPlayer();
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!progressRef.current) return;
    
    setIsDragging(true);
    const rect = progressRef.current.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const newTime = (percentage / 100) * progress.duration;
    setDragValue(newTime);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newTime = (percentage / 100) * progress.duration;
    setDragValue(newTime);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      seek(dragValue);
      setIsDragging(false);
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragValue]);

  const displayTime = isDragging ? dragValue : progress.currentTime;
  const displayPercentage = isDragging 
    ? (dragValue / progress.duration) * 100 
    : progress.percentage;

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-xs text-muted-foreground min-w-[40px] text-right">
        {formatTime(displayTime)}
      </span>
      
      <div 
        ref={progressRef}
        className="flex-1 h-2 bg-secondary rounded-full cursor-pointer group relative"
        onMouseDown={handleMouseDown}
      >
        <div 
          className="h-full bg-primary rounded-full transition-all duration-150 relative progress-glow"
          style={{ width: `${Math.max(0, Math.min(100, displayPercentage))}%` }}
        >
          <div 
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-primary rounded-full shadow-lg transition-all duration-150 ${
              isDragging ? 'scale-125' : 'group-hover:scale-110'
            }`}
          />
        </div>
      </div>
      
      <span className="text-xs text-muted-foreground min-w-[40px]">
        {formatTime(progress.duration)}
      </span>
    </div>
  );
}