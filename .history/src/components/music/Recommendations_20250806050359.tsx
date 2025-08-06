

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Song, MusicSourceType } from '@/types/music';
import { Sparkles, Play, Plus, RefreshCw } from 'lucide-react';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getRecommendations, playSong, addToQueue, setQueue } = useMusicPlayer();

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const results = await getRecommendations();
      setRecommendations(results);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handlePlay = async (song: Song, index: number) => {
    setQueue(recommendations);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={20} />
            Recommendations
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRecommendations}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recommendations available</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadRecommendations}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {recommendations.map((song, index) => (
              <div 
                key={song.id}
                className="group p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Album Art */}
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

                  {/* Song Info */}
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

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddToQueue(song)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus size={14} />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePlay(song, index)}
                      className="h-8 w-8 p-0"
                    >
                      <Play size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}