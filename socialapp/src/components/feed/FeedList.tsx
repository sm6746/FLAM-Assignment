import React from 'react';
import { FeedItem } from '../../models/Post';
import { PostItem } from './PostItem';
import { LoadingSpinner } from '../ui/loading-spinner';

interface FeedListProps {
  items: FeedItem[];
  onLike: (postId: string) => void;
  onRetweet: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onVotePoll?: (postId: string, optionId: string) => void;
  onToggleEventAttendance?: (postId: string) => void;
  isLoadingMore: boolean;
  hasMore: boolean;
  isOnline: boolean;
}

export const FeedList: React.FC<FeedListProps> = ({
  items,
  onLike,
  onRetweet,
  onBookmark,
  onVotePoll,
  onToggleEventAttendance,
  isLoadingMore,
  hasMore,
  isOnline,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
        <p className="text-muted-foreground">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <PostItem
          key={item.id}
          feedItem={item}
          onLike={onLike}
          onRetweet={onRetweet}
          onBookmark={onBookmark}
          onVotePoll={onVotePoll}
          onToggleEventAttendance={onToggleEventAttendance}
          isOnline={isOnline}
        />
      ))}
      
      {isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-2 text-muted-foreground">Loading more posts...</span>
        </div>
      )}
      
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You've reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
};