
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  followerCount: number;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface PostMetrics {
  likes: number;
  retweets: number;
  comments: number;
  views: number;
}

export interface PostInteractions {
  isLiked: boolean;
  isRetweeted: boolean;
  isBookmarked: boolean;
}

export type PostType = 'text' | 'image' | 'video' | 'poll' | 'quote' | 'article' | 'event';


export interface FeedItemPlugin {
  id: string;
  name: string;
  type: PostType;
  render: (post: Post) => React.ReactNode;
  validate: (post: Post) => boolean;
  getHeight?: (post: Post) => number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  endDate: Date;
  isVoted: boolean;
  votedOption?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  attendees: number;
  maxAttendees?: number;
  isAttending: boolean;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: number;
  source: string;
  url: string;
  image?: string;
}

export interface Post {
  id: string;
  type: PostType;
  author: User;
  content: string;
  media?: MediaItem[];
  metrics: PostMetrics;
  interactions: PostInteractions;
  timestamp: Date;
  replyTo?: string;
  quotedPost?: Post;
  hashtags: string[];
  mentions: string[];
 
  poll?: Poll;
  event?: Event;
  article?: Article;
}

export interface FeedItem {
  id: string;
  post: Post;
  feedType: 'timeline' | 'trending' | 'promoted';
  insertedAt: Date;
  height?: number; 
}


export class PostOperations {
  static toggleLike(post: Post): Post {
    return {
      ...post,
      interactions: {
        ...post.interactions,
        isLiked: !post.interactions.isLiked,
      },
      metrics: {
        ...post.metrics,
        likes: post.interactions.isLiked 
          ? post.metrics.likes - 1 
          : post.metrics.likes + 1,
      },
    };
  }

  static toggleRetweet(post: Post): Post {
    return {
      ...post,
      interactions: {
        ...post.interactions,
        isRetweeted: !post.interactions.isRetweeted,
      },
      metrics: {
        ...post.metrics,
        retweets: post.interactions.isRetweeted 
          ? post.metrics.retweets - 1 
          : post.metrics.retweets + 1,
      },
    };
  }

  static toggleBookmark(post: Post): Post {
    return {
      ...post,
      interactions: {
        ...post.interactions,
        isBookmarked: !post.interactions.isBookmarked,
      },
    };
  }

  static votePoll(post: Post, optionId: string): Post {
    if (!post.poll) return post;
    
    const updatedPoll = {
      ...post.poll,
      options: post.poll.options.map(option => ({
        ...option,
        votes: option.id === optionId ? option.votes + 1 : option.votes,
      })),
      isVoted: true,
      votedOption: optionId,
    };
    
    
    const totalVotes = updatedPoll.options.reduce((sum, option) => sum + option.votes, 0);
    updatedPoll.totalVotes = totalVotes;
    updatedPoll.options = updatedPoll.options.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
    }));
    
    return {
      ...post,
      poll: updatedPoll,
    };
  }

  static toggleEventAttendance(post: Post): Post {
    if (!post.event) return post;
    
    return {
      ...post,
      event: {
        ...post.event,
        isAttending: !post.event.isAttending,
        attendees: post.event.isAttending 
          ? post.event.attendees - 1 
          : post.event.attendees + 1,
      },
    };
  }

  static formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return timestamp.toLocaleDateString();
  }

  static formatMetric(count: number): string {
    if (count < 1000) return count.toString();
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
    return `${(count / 1000000).toFixed(1)}M`;
  }

  
  static calculateContentHeight(post: Post): number {
    let baseHeight = 120; 
    
   
    const contentLength = post.content.length;
    const contentHeight = Math.ceil(contentLength / 50) * 20;
    baseHeight += contentHeight;
    
    
    if (post.media && post.media.length > 0) {
      const mediaHeight = post.media.reduce((height, media) => {
        if (media.height && media.width) {
          
          return Math.max(height, (media.height / media.width) * 600);
        }
        return height + 300;
      }, 0);
      baseHeight += mediaHeight;
    }
    
    
    if (post.poll) {
      baseHeight += 60 + (post.poll.options.length * 40);
    }
    
    if (post.event) {
      baseHeight += 120;
    }
    
    if (post.article) {
      baseHeight += 80;
    }
    
    if (post.quotedPost) {
      baseHeight += 100;
    }
    
    return Math.max(baseHeight, 200); 
  }
}