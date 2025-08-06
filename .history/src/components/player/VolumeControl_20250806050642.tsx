

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

export function VolumeControl() {
  const { state, setVolume } = useMusicPlayer();
  const [showSlider, setShowSlider] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.8);

  const getVolumeIcon = () => {
    if (state.volume === 0) return VolumeX;
    if (state.volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (state.volume === 0) {
      setVolume(previousVolume);
    } else {
      setPreviousVolume(state.volume);
      setVolume(0);
    }
  };

  return (
    <div 
      className="flex items-center gap-2 relative"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMute}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <VolumeIcon size={16} />
      </Button>
      
      <div 
        className={`transition-all duration-200 overflow-hidden ${
          showSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer volume-slider"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${state.volume * 100}%, hsl(var(--secondary)) ${state.volume * 100}%, hsl(var(--secondary)) 100%)`
          }}
        />
      </div>
    </div>
  );
}