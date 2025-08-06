import React from 'react';
import { Post } from '../../models/Post';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Clock, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PostArticleProps {
  article: Post['article'];
  disabled?: boolean;
}

export const PostArticle: React.FC<PostArticleProps> = ({ article, disabled = false }) => {
  if (!article) return null;

  const handleReadMore = () => {
    if (!disabled) {
      window.open(article.url, '_blank');
    }
  };

  return (
    <Card className="mt-3 overflow-hidden">
      <CardContent className="p-0">
        {article.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{article.source}</span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{article.readTime} min read</span>
            </div>
          </div>
          
          <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
            {article.title}
          </h4>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {article.excerpt}
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReadMore}
            disabled={disabled}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Read Full Article
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 