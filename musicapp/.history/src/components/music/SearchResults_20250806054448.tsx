

import React from 'react';
import { Song, MusicSourceType } from '@/types/music';
import { useMusicPlayer } from '@//contexts/MusicPlayerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Plus } from 'lucide-react';

interface SearchResultsProps {
  results: Song[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { playSong, addToQueue, setQueue } = useMusicPlayer();

  const handlePlay = async (song: Song, index: number) => {
    
    setQueue(results);
    await playSong(song, index);
  };

  const handleAddToQueue = (song: Song) => {
    addToQueue(song);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="w-20 h-4 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No results found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((song, index) => (
        <Card key={song.id} className="group hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
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
                    <div className="w-6 h-6 bg-primary/30 rounded" />
                  </div>
                )}
              </div>

              {}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium truncate">{song.title}</h4>
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
                <p className="text-sm text-muted-foreground truncate">
                  {song.artist} • {song.album}
                </p>
              </div>

              {}
              <div className="text-sm text-muted-foreground">
                {formatDuration(song.duration)}
              </div>

              {}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddToQueue(song)}
                  className="h-8 w-8 p-0"
                >
                  <Plus size={16} />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handlePlay(song, index)}
                  className="h-8 w-8 p-0"
                >
                  <Play size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}