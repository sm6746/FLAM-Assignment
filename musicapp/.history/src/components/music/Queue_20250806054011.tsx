

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Song, MusicSourceType } from '@/types/music';
import { Play, X, Music } from 'lucide-react';

export function Queue() {
  const { state, playSong, removeFromQueue } = useMusicPlayer();

  const handlePlaySong = async (song: Song, index: number) => {
    await playSong(song, index);
  };

  const handleRemoveSong = (index: number) => {
    removeFromQueue(index);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (state.queue.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music size={20} />
            Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Music size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No songs in queue</p>
            <p className="text-sm text-muted-foreground">Search and add songs to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music size={20} />
          Queue ({state.queue.length} songs)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {state.queue.map((song, index) => (
            <div 
              key={`${song.id}-${index}`}
              className={`group p-3 rounded-lg border transition-colors ${
                index === state.currentIndex 
                  ? 'bg-primary/10 border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {}
                <div className="w-6 text-center">
                  {index === state.currentIndex ? (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  )}
                </div>

                {}
                <div className="w-10 h-10 rounded overflow-hidden bg-muted">
                  {song.imageUrl ? (
                    <img 
                      src={song.imageUrl} 
                      alt={`${song.album} cover`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary/30 rounded" />
                    </div>
                  )}
                </div>

                {}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{song.title}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        song.source === MusicSourceType.SPOTIFY 
                          ? 'border-green-500/50 text-green-500' 
                          : 'border-blue-500/50 text-blue-500'
                      }`}
                    >
                      {song.source}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {song.artist} • {formatDuration(song.duration)}
                  </p>
                </div>

                {}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index !== state.currentIndex && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlaySong(song, index)}
                      className="h-8 w-8 p-0"
                    >
                      <Play size={14} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSong(index)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}