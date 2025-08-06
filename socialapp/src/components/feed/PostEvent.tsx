import React from 'react';
import { Post } from '../../models/Post';
import { Button } from '../ui/button';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PostEventProps {
  event: Post['event'];
  onToggleAttendance: () => void;
  disabled?: boolean;
}

export const PostEvent: React.FC<PostEventProps> = ({ event, onToggleAttendance, disabled = false }) => {
  if (!event) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const isFull = event.maxAttendees && event.attendees >= event.maxAttendees;

  return (
    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-foreground">{event.title}</h4>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{event.attendees}</span>
          {event.maxAttendees && (
            <span>/ {event.maxAttendees}</span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatDate(event.startDate)} • {formatTime(event.startDate)} - {formatTime(event.endDate)}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{event.location}</span>
        </div>
      </div>
      
      <Button
        variant={event.isAttending ? "outline" : "default"}
        size="sm"
        onClick={onToggleAttendance}
        disabled={disabled || isFull}
        className={cn(
          "w-full",
          event.isAttending && "border-primary text-primary hover:bg-primary/5"
        )}
      >
        {event.isAttending ? 'Cancel Attendance' : 'Attend Event'}
        {isFull && !event.isAttending && ' (Full)'}
      </Button>
    </div>
  );
}; 