

import React from 'react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@//contexts/MusicPlayerContext';
import { PlaybackState } from '@/types/music';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Loader2
} from 'lucide-react';

export function PlayerControls() {
  const { 
    state, 
    pause, 
    resume, 
    playNext, 
    playPrevious, 
    toggleShuffle, 
    cycleRepeat 
  } = useMusicPlayer();

  const handlePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const getRepeatIcon = () => {
    switch (state.repeat) {
      case 'one':
        return Repeat1;
      case 'all':
        return Repeat;
      default:
        return Repeat;
    }
  };

  const RepeatIcon = getRepeatIcon();

  const isLoading = state.playbackState === PlaybackState.LOADING;

  return (
    <div className="flex items-center justify-center gap-2">
      {}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleShuffle}
        className={`transition-colors ${
          state.shuffle 
            ? 'text-primary hover:text-primary/80' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Shuffle size={16} />
      </Button>

      {}
      <Button
        variant="ghost"
        size="sm"
        onClick={playPrevious}
        disabled={state.queue.length === 0}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <SkipBack size={20} />
      </Button>

      {}
      <Button
        variant="default"
        size="default"
        onClick={handlePlayPause}
        disabled={!state.currentSong || isLoading}
        className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105 music-glow"
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : state.isPlaying ? (
          <Pause size={20} />
        ) : (
          <Play size={20} className="ml-0.5" />
        )}
      </Button>

      {}
      <Button
        variant="ghost"
        size="sm"
        onClick={playNext}
        disabled={state.queue.length === 0}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <SkipForward size={20} />
      </Button>

      {}
      <Button
        variant="ghost"
        size="sm"
        onClick={cycleRepeat}
        className={`transition-colors ${
          state.repeat !== 'none' 
            ? 'text-primary hover:text-primary/80' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <RepeatIcon size={16} />
      </Button>
    </div>
  );
}