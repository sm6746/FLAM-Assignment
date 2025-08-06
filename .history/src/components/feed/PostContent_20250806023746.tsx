import React from 'react';
import { Post } from '../../models/Post';
import { PostPoll } from './PostPoll';
import { PostEvent } from './PostEvent';
import { PostArticle } from './PostArticle';
import { PluginService } from '../../services/PluginService';

interface PostContentProps {
  post: Post;
  onVotePoll?: (optionId: string) => void;
  onToggleEventAttendance?: () => void;
  disabled?: boolean;
}

export const PostContent: React.FC<PostContentProps> = ({ 
  post, 
  onVotePoll, 
  onToggleEventAttendance, 
  disabled = false 
}) => {
  const { content, hashtags, mentions, type } = post;

  // Simple text processing for hashtags and mentions
  const processContent = (text: string) => {
    let processedText = text;
    
    // Replace hashtags
    hashtags.forEach(hashtag => {
      const regex = new RegExp(`(${hashtag})`, 'gi');
      processedText = processedText.replace(regex, `<span class="text-primary font-medium cursor-pointer hover:underline">$1</span>`);
    });
    
    // Replace mentions
    mentions.forEach(mention => {
      const regex = new RegExp(`(${mention})`, 'gi');
      processedText = processedText.replace(regex, `<span class="text-primary font-medium cursor-pointer hover:underline">$1</span>`);
    });
    
    return processedText;
  };

  // Check if there's a custom plugin renderer for this post type
  const customRenderer = PluginService.renderPost(post);

  return (
    <div className="mb-3">
      {/* Main content */}
      <div 
        className="text-foreground leading-relaxed whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: processContent(content) }}
      />
      
      {/* Display hashtags and mentions separately if desired */}
      {(hashtags.length > 0 || mentions.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {hashtags.map(hashtag => (
            <span 
              key={hashtag}
              className="text-primary text-sm font-medium cursor-pointer hover:underline"
            >
              {hashtag}
            </span>
          ))}
          {mentions.map(mention => (
            <span 
              key={mention}
              className="text-primary text-sm font-medium cursor-pointer hover:underline"
            >
              {mention}
            </span>
          ))}
        </div>
      )}

      {/* Custom plugin renderer */}
      {customRenderer && (
        <div className="mt-3">
          {customRenderer}
        </div>
      )}

      {/* Built-in post type renderers */}
      {!customRenderer && (
        <>
          {/* Poll content */}
          {post.poll && onVotePoll && (
            <PostPoll 
              poll={post.poll} 
              onVote={onVotePoll}
              disabled={disabled}
            />
          )}

          {/* Event content */}
          {post.event && onToggleEventAttendance && (
            <PostEvent 
              event={post.event} 
              onToggleAttendance={onToggleEventAttendance}
              disabled={disabled}
            />
          )}

          {/* Article content */}
          {post.article && (
            <PostArticle 
              article={post.article}
              disabled={disabled}
            />
          )}
        </>
      )}
    </div>
  );
};