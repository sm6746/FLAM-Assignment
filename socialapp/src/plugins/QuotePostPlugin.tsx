import React from 'react';
import { FeedItemPlugin, Post } from '../models/Post';
import { Card, CardContent } from '../components/ui/card';
import { Quote } from 'lucide-react';


export const QuotePostPlugin: FeedItemPlugin = {
  id: 'quote-renderer',
  name: 'Quote Post Renderer',
  type: 'quote',
  
  validate: (post: Post): boolean => {
    return post.type === 'quote' && !!post.quotedPost;
  },
  
  render: (post: Post): React.ReactNode => {
    if (!post.quotedPost) return null;
    
    return (
      <Card className="mt-3 border-l-4 border-l-blue-200 dark:border-l-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Quote className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">
                  {post.quotedPost.author.displayName}
                </span>
                <span className="text-muted-foreground text-sm">
                  @{post.quotedPost.author.username}
                </span>
                {post.quotedPost.author.isVerified && (
                  <span className="text-blue-500 text-sm">✓</span>
                )}
              </div>
              
              <p className="text-sm text-foreground mb-2">
                {post.quotedPost.content}
              </p>
              
              {post.quotedPost.media && post.quotedPost.media.length > 0 && (
                <div className="rounded-lg overflow-hidden mb-2">
                  <img
                    src={post.quotedPost.media[0].url}
                    alt={post.quotedPost.media[0].alt || 'Quoted post media'}
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{post.quotedPost.metrics.likes} likes</span>
                <span>{post.quotedPost.metrics.retweets} retweets</span>
                <span>{post.quotedPost.metrics.comments} replies</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
  
  getHeight: (post: Post): number => {
    if (!post.quotedPost) return 0;
    
    let height = 120; 
    
   
    const contentLength = post.quotedPost.content.length;
    height += Math.ceil(contentLength / 50) * 20;
    
    if (post.quotedPost.media && post.quotedPost.media.length > 0) {
      height += 128; 
    }
    
    return height;
  },
}; 