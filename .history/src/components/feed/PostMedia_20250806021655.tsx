import React, { useState } from 'react';
import { MediaItem } from '../../models/Post';
import { Play, ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PostMediaProps {
  media: MediaItem[];
}

export const PostMedia: React.FC<PostMediaProps> = ({ media }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (mediaId: string) => {
    setLoadedImages(prev => new Set(prev).add(mediaId));
  };

  const handleImageError = (mediaId: string) => {
    setFailedImages(prev => new Set(prev).add(mediaId));
  };

  if (!media.length) return null;

  const renderMedia = (item: MediaItem) => {
    const isLoaded = loadedImages.has(item.id);
    const hasFailed = failedImages.has(item.id);

    if (item.type === 'image') {
      return (
        <div 
          key={item.id}
          className="relative overflow-hidden rounded-lg bg-muted"
          style={{ aspectRatio: item.width && item.height ? `${item.width}/${item.height}` : '16/9' }}
        >
          {!isLoaded && !hasFailed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
          )}
          
          {hasFailed ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Failed to load image</p>
              </div>
            </div>
          ) : (
            <img
              src={item.url}
              alt={item.alt || 'Post image'}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => handleImageLoad(item.id)}
              onError={() => handleImageError(item.id)}
              loading="lazy"
            />
          )}
        </div>
      );
    }

    if (item.type === 'video') {
      return (
        <div 
          key={item.id}
          className="relative overflow-hidden rounded-lg bg-muted cursor-pointer group"
          style={{ aspectRatio: item.width && item.height ? `${item.width}/${item.height}` : '16/9' }}
        >
          <img
            src={item.thumbnail || item.url}
            alt={item.alt || 'Video thumbnail'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="bg-black/60 rounded-full p-3 group-hover:scale-110 transition-transform">
              <Play className="h-6 w-6 text-white fill-current" />
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Video
          </div>
        </div>
      );
    }

    return null;
  };

  // Handle different media layouts
  const getMediaLayout = () => {
    if (media.length === 1) {
      return (
        <div className="mt-3">
          {renderMedia(media[0])}
        </div>
      );
    }

    if (media.length === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {media.map(renderMedia)}
        </div>
      );
    }

    if (media.length === 3) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="row-span-2">
            {renderMedia(media[0])}
          </div>
          <div className="grid grid-rows-2 gap-2">
            {renderMedia(media[1])}
            {renderMedia(media[2])}
          </div>
        </div>
      );
    }

    if (media.length === 4) {
      return (
        <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-2">
          {media.map(renderMedia)}
        </div>
      );
    }

    // For more than 4 items, show first 3 + "more" indicator
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="row-span-2">
          {renderMedia(media[0])}
        </div>
        <div className="grid grid-rows-2 gap-2">
          {renderMedia(media[1])}
          <div className="relative">
            {renderMedia(media[2])}
            {media.length > 3 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                <span className="text-white font-semibold text-lg">
                  +{media.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return getMediaLayout();
};