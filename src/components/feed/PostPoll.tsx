import React from 'react';
import { Post, PollOption } from '../../models/Post';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PostPollProps {
  poll: Post['poll'];
  onVote: (optionId: string) => void;
  disabled?: boolean;
}

export const PostPoll: React.FC<PostPollProps> = ({ poll, onVote, disabled = false }) => {
  if (!poll) return null;

  const handleVote = (optionId: string) => {
    if (!disabled && !poll.isVoted) {
      onVote(optionId);
    }
  };

  return (
    <div className="mt-3 p-4 bg-muted/30 rounded-lg border">
      <h4 className="font-semibold mb-3 text-foreground">{poll.question}</h4>
      
      <div className="space-y-2">
        {poll.options.map((option) => (
          <div key={option.id} className="relative">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                poll.isVoted && option.id === poll.votedOption && "border-primary bg-primary/5",
                poll.isVoted && "cursor-default"
              )}
              onClick={() => handleVote(option.id)}
              disabled={disabled || poll.isVoted}
            >
              <div className="flex items-center justify-between w-full">
                <span className="flex-1">{option.text}</span>
                
                {poll.isVoted && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {option.percentage.toFixed(1)}%
                    </span>
                    {option.id === poll.votedOption && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                )}
              </div>
            </Button>
            
            {poll.isVoted && (
              <div className="absolute inset-0 pointer-events-none">
                <Progress 
                  value={option.percentage} 
                  className="h-full rounded-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-sm text-muted-foreground">
        {poll.totalVotes} votes • Ends {poll.endDate.toLocaleDateString()}
      </div>
    </div>
  );
}; 