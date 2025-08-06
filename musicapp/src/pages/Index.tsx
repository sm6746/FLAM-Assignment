

import React, { useState } from 'react';
import { MusicPlayer } from '@/components/player/MusicPlayer';
import { SearchBar } from '@/components/music/SearchBar';
import { SearchResults } from '@/components/music/SearchResults';
import { Queue } from '@/components/music/Queue';
import { Recommendations } from '@/components/music/Recommendations';
import { Song } from '@/types/music';

const Index = () => {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-32">
      {}
      <div className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Design Patterns Music Player
          </h1>
          <p className="text-muted-foreground mt-2">
            Showcasing Strategy, Singleton, Observer, and Factory patterns
          </p>
        </div>
      </div>

      {}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {}
          <div className="lg:col-span-2 space-y-6">
            <SearchBar 
              onResults={setSearchResults}
              onLoadingChange={setIsSearchLoading}
            />
            
            {(searchResults.length > 0 || isSearchLoading) && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <SearchResults 
                  results={searchResults}
                  isLoading={isSearchLoading}
                />
              </div>
            )}
            
            <Recommendations />
          </div>

          {}
          <div className="space-y-6">
            <Queue />
          </div>
        </div>
      </div>

      {}
      <MusicPlayer />
    </div>
  );
};

export default Index;
