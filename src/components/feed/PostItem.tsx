import React from 'react';
import { FeedItem } from '../../models/Post';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';
import { PostMedia } from './PostMedia';

interface PostItemProps {
  feedItem: FeedItem;
  onLike: (postId: string) => void;
  onRetweet: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onVotePoll?: (postId: string, optionId: string) => void;
  onToggleEventAttendance?: (postId: string) => void;
  isOnline: boolean;
}

export const PostItem: React.FC<PostItemProps> = ({
  feedItem,
  onLike,
  onRetweet,
  onBookmark,
  onVotePoll,
  onToggleEventAttendance,
  isOnline,
}) => {
  const { post, feedType } = feedItem;

  const handleVotePoll = (optionId: string) => {
    if (onVotePoll) {
      onVotePoll(post.id, optionId);
    }
  };

  const handleToggleEventAttendance = () => {
    if (onToggleEventAttendance) {
      onToggleEventAttendance(post.id);
    }
  };

  return (
    <article 
      className={`
        bg-post-bg hover:bg-post-hover transition-colors duration-150
        border-l-2 p-4 cursor-pointer
        ${feedType === 'promoted' ? 'border-l-primary' : 
          feedType === 'trending' ? 'border-l-verified' : 
          'border-l-transparent'}
      `}
    >
      {}
      {feedType !== 'timeline' && (
        <div className="mb-2 text-xs text-muted-foreground">
          {feedType === 'promoted' && '📢 Promoted'}
          {feedType === 'trending' && '🔥 Trending'}
        </div>
      )}

      <PostHeader post={post} />
      
      <PostContent 
        post={post}
        onVotePoll={handleVotePoll}
        onToggleEventAttendance={handleToggleEventAttendance}
        disabled={!isOnline}
      />
      
      {post.media && post.media.length > 0 && (
        <PostMedia media={post.media} />
      )}
      
      <PostActions
        post={post}
        onLike={() => onLike(post.id)}
        onRetweet={() => onRetweet(post.id)}
        onBookmark={() => onBookmark(post.id)}
        disabled={!isOnline}
      />
    </article>
  );
};