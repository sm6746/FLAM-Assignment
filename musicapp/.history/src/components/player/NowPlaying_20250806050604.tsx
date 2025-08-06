

import React from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Badge } from '@/components/ui/badge';
import { MusicSourceType } from '@/types/music';

export function NowPlaying() {
  const { state } = useMusicPlayer();

  if (!state.currentSong) {
    return (
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-muted-foreground/20 rounded" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">No song selected</p>
          <p className="text-xs text-muted-foreground">Choose a track to play</p>
        </div>
      </div>
    );
  }

  const { currentSong } = state;

  return (
    <div className="flex items-center gap-3 min-w-0">
      {}
      <div className={`relative w-12 h-12 rounded-lg overflow-hidden bg-muted ${state.isPlaying ? 'animate-pulse-glow' : ''}`}>
        {currentSong.imageUrl ? (
          <img 
            src={currentSong.imageUrl} 
            alt={`${currentSong.album} cover`}
            className={`w-full h-full object-cover ${state.isPlaying ? 'animate-vinyl-spin' : ''}`}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="w-6 h-6 bg-primary/30 rounded" />
          </div>
        )}
      </div>

      {}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium truncate text-foreground">
            {currentSong.title}
          </h4>
          <Badge 
            variant="outline" 
            className={`text-xs px-1.5 py-0.5 ${
              currentSong.source === MusicSourceType.SPOTIFY 
                ? 'border-green-500/50 text-green-500' 
                : 'border-blue-500/50 text-blue-500'
            }`}
          >
            {currentSong.source}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {currentSong.artist} • {currentSong.album}
        </p>
      </div>
    </div>
  );
}