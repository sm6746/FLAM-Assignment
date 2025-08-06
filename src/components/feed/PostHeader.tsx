import React from 'react';
import { Post, PostOperations } from '../../models/Post';
import { BadgeCheck, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';

interface PostHeaderProps {
  post: Post;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  const { author, timestamp } = post;

  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} alt={author.displayName} />
          <AvatarFallback>
            {author.displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">
              {author.displayName}
            </span>
            {author.isVerified && (
              <BadgeCheck className="h-4 w-4 text-verified" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{author.username}</span>
            <span>·</span>
            <span>{PostOperations.formatTimestamp(timestamp)}</span>
          </div>
        </div>
      </div>
      
      <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
};