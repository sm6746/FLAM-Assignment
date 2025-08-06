
import React from 'react';
import { Card } from '@/components/ui/card';
import { useMusicPlayer } from '@//contexts/MusicPlayerContext';
import { NowPlaying } from './NowPlaying';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { useToast } from '@/hooks/use-toast';

export function MusicPlayer() {
  const { error } = useMusicPlayer();
  const { toast } = useToast();

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Player Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t border-l-0 border-r-0 border-b-0 player-surface backdrop-blur-xl">
      <div className="p-4">
        {}
        <div className="mb-4">
          <ProgressBar />
        </div>
        
        {}
        <div className="flex items-center justify-between gap-4">
          {}
          <div className="flex-1 min-w-0">
            <NowPlaying />
          </div>
          
          {}
          <div className="flex-shrink-0">
            <PlayerControls />
          </div>
          
          {}
          <div className="flex-1 flex justify-end min-w-0">
            <VolumeControl />
          </div>
        </div>
      </div>
    </Card>
  );
}