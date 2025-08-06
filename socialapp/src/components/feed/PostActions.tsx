import React from 'react';
import { Post, PostOperations } from '../../models/Post';
import { Heart, MessageCircle, Repeat2, Bookmark, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface PostActionsProps {
  post: Post;
  onLike: () => void;
  onRetweet: () => void;
  onBookmark: () => void;
  disabled?: boolean;
}

export const PostActions: React.FC<PostActionsProps> = ({
  post,
  onLike,
  onRetweet,
  onBookmark,
  disabled = false,
}) => {
  const { metrics, interactions } = post;

  const ActionButton: React.FC<{
    icon: React.ReactNode;
    count?: number;
    isActive?: boolean;
    onClick?: () => void;
    activeColor?: string;
    disabled?: boolean;
  }> = ({ icon, count, isActive, onClick, activeColor, disabled }) => (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 px-2 gap-1 text-muted-foreground hover:text-foreground transition-colors",
        isActive && activeColor && `text-${activeColor}`,
        disabled && "cursor-not-allowed opacity-50"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {count !== undefined && count > 0 && (
        <span className="text-xs">
          {PostOperations.formatMetric(count)}
        </span>
      )}
    </Button>
  );

  return (
    <div className="flex items-center justify-between max-w-md mt-2">
      <ActionButton
        icon={<MessageCircle className="h-4 w-4" />}
        count={metrics.comments}
        onClick={() => console.log('Reply clicked')}
        disabled={disabled}
      />
      
      <ActionButton
        icon={<Repeat2 className="h-4 w-4" />}
        count={metrics.retweets}
        isActive={interactions.isRetweeted}
        onClick={onRetweet}
        activeColor="retweet"
        disabled={disabled}
      />
      
      <ActionButton
        icon={
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              interactions.isLiked && "fill-current"
            )} 
          />
        }
        count={metrics.likes}
        isActive={interactions.isLiked}
        onClick={onLike}
        activeColor="like"
        disabled={disabled}
      />
      
      <ActionButton
        icon={
          <Bookmark 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              interactions.isBookmarked && "fill-current"
            )} 
          />
        }
        isActive={interactions.isBookmarked}
        onClick={onBookmark}
        activeColor="verified"
        disabled={disabled}
      />
      
      <ActionButton
        icon={<Share className="h-4 w-4" />}
        onClick={() => console.log('Share clicked')}
        disabled={disabled}
      />
    </div>
  );
};