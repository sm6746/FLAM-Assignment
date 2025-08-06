

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';
import { useMusicPlayer } from '@//contexts/MusicPlayerContext';
import { Song } from '@/types/music';

interface SearchBarProps {
  onResults: (results: Song[]) => void;
  onLoadingChange: (loading: boolean) => void;
}

export function SearchBar({ onResults, onLoadingChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { search } = useMusicPlayer();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    onLoadingChange(true);

    try {
      const results = await search(query.trim());
      onResults(results);
    } catch (error) {
      console.error('Search error:', error);
      onResults([]);
    } finally {
      setIsSearching(false);
      onLoadingChange(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search size={20} />
          Search Music
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Search for songs, artists, or albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
          >
            {isSearching ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}