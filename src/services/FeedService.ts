import { Post, User, FeedItem, Poll, Event, Article } from '../models/Post';


export class FeedService {
  private static generateMockUser(id: string): User {
    const users = [
      { username: 'alex_dev', displayName: 'Alex Chen', isVerified: true },
      { username: 'maria_design', displayName: 'Maria Rodriguez', isVerified: false },
      { username: 'david_tech', displayName: 'David Kim', isVerified: true },
      { username: 'sarah_writer', displayName: 'Sarah Johnson', isVerified: false },
      { username: 'mike_code', displayName: 'Mike Thompson', isVerified: true },
      { username: 'lisa_ux', displayName: 'Lisa Park', isVerified: false },
      { username: 'james_arch', displayName: 'James Wilson', isVerified: true },
      { username: 'emma_data', displayName: 'Emma Davis', isVerified: false },
    ];
    
    const user = users[parseInt(id) % users.length];
    return {
      id,
      ...user,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      followerCount: Math.floor(Math.random() * 50000) + 1000,
    };
  }

  private static generateMockPoll(id: string): Poll {
    const questions = [
      "What's your go-to coffee order?",
      "Which movie genre do you prefer?",
      "What's your favorite way to spend a weekend?",
      "Which season is your favorite?",
      "What's your preferred workout?",
    ];
    
    const options = [
      ["Espresso", "Cappuccino", "Latte", "Americano"],
      ["Action", "Comedy", "Drama", "Sci-Fi"],
      ["Netflix & chill", "Outdoor adventure", "Cooking", "Gaming"],
      ["Spring", "Summer", "Fall", "Winter"],
      ["Running", "Yoga", "Weightlifting", "Swimming"],
    ];
    
    const questionIndex = parseInt(id) % questions.length;
    const question = questions[questionIndex];
    const questionOptions = options[questionIndex];
    
    const pollOptions = questionOptions.map((text, index) => ({
      id: `option_${id}_${index}`,
      text,
      votes: Math.floor(Math.random() * 200) + 10,
      percentage: 0,
    }));
    
    const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0);
    pollOptions.forEach(option => {
      option.percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
    });
    
    return {
      id: `poll_${id}`,
      question,
      options: pollOptions,
      totalVotes,
      endDate: new Date(Date.now() + Math.random() * 86400000 * 7),
      isVoted: Math.random() > 0.7,
      votedOption: Math.random() > 0.7 ? pollOptions[Math.floor(Math.random() * pollOptions.length)].id : undefined,
    };
  }

  private static generateMockEvent(id: string): Event {
    const events = [
      {
        title: "Local Tech Meetup",
        description: "Join us for networking and talks about the latest in web development.",
        location: "Downtown Coffee Shop",
      },
      {
        title: "Design Workshop",
        description: "Learn UI/UX best practices and design thinking methodologies.",
        location: "Creative Hub",
      },
      {
        title: "Startup Pitch Night",
        description: "Watch local entrepreneurs pitch their ideas and get feedback.",
        location: "Innovation Center",
      },
      {
        title: "Code & Coffee",
        description: "Casual coding session with fellow developers. Bring your laptop!",
        location: "Tech Cafe",
      },
    ];
    
    const event = events[parseInt(id) % events.length];
    const startDate = new Date(Date.now() + Math.random() * 86400000 * 30);
    const endDate = new Date(startDate.getTime() + 86400000 * 2);
    
    return {
      id: `event_${id}`,
      ...event,
      startDate,
      endDate,
      attendees: Math.floor(Math.random() * 100) + 20,
      maxAttendees: Math.floor(Math.random() * 50) + 50,
      isAttending: Math.random() > 0.8,
    };
  }

  private static generateMockArticle(id: string): Article {
    const articles = [
      {
        title: "Why I Switched from React to Vue",
        excerpt: "After 3 years of React development, here's what made me change my mind about Vue.js.",
        source: "Dev Blog",
        readTime: 5,
      },
      {
        title: "The Hidden Costs of Technical Debt",
        excerpt: "How ignoring code quality can impact your team's productivity and mental health.",
        source: "Engineering Weekly",
        readTime: 8,
      },
      {
        title: "Building a Design System from Scratch",
        excerpt: "Lessons learned from creating a comprehensive design system for a growing startup.",
        source: "Design Matters",
        readTime: 12,
      },
      {
        title: "Remote Work: The Good, Bad, and Ugly",
        excerpt: "Two years of remote work experience and what I wish I knew from the start.",
        source: "Work Life",
        readTime: 6,
      },
    ];
    
    const article = articles[parseInt(id) % articles.length];
    
    return {
      id: `article_${id}`,
      ...article,
      url: `https://example.com/article/${id}`,
      image: Math.random() > 0.3 ? `https://picsum.photos/600/300?random=${id}` : undefined,
    };
  }

  private static generateMockPost(id: string): Post {
    const contents = [
      "Just finished a 12-hour coding session and finally got that bug fixed! 🎉 Sometimes you just need to step away and come back with fresh eyes.",
      "Had an amazing conversation with @maria_design about design systems today. The importance of consistency in UI can't be overstated.",
      "Working from home today because of the rain. Perfect weather for debugging and coffee ☕️",
      "Spent the weekend building a side project. It's amazing how much you can learn when you're not constrained by deadlines.",
      "Team lunch today was great! Love working with people who are passionate about what they do.",
      "Just deployed our new feature to production. Fingers crossed everything goes smoothly! 🤞",
      "Reading through some old code I wrote 6 months ago. Wow, I've learned so much since then. Growth is real!",
      "Coffee break with the team. These casual conversations often lead to the best ideas.",
      "Finally got that performance optimization working. 40% improvement in load times! 🚀",
      "Late night coding session. Sometimes the best solutions come when everyone else is asleep.",
      "Had a great code review today. Love working with a team that values code quality.",
      "Weekend project update: Still working on that personal website. Taking longer than expected but learning a lot!",
      "Just finished a book on system design. Mind blown by some of the concepts. Always learning! 📚",
      "Team retrospective today. Great to see how far we've come and plan for the future.",
      "Debugging session with @david_tech. Two heads are definitely better than one!",
    ];

    const types = ['text', 'image', 'video', 'poll', 'event', 'article'] as const;
    const type = types[parseInt(id) % types.length];
    
    let media = undefined;
    let poll = undefined;
    let event = undefined;
    let article = undefined;
    
    if (type === 'image') {
      media = [{
        id: `media_${id}`,
        type: 'image' as const,
        url: `https://picsum.photos/600/400?random=${id}`,
        alt: 'Random image',
        width: 600,
        height: 400,
      }];
    } else if (type === 'video') {
      media = [{
        id: `media_${id}`,
        type: 'video' as const,
        url: `https://example.com/video_${id}.mp4`,
        thumbnail: `https://picsum.photos/600/400?random=${id}`,
        alt: 'Video thumbnail',
        width: 600,
        height: 400,
      }];
    } else if (type === 'poll') {
      poll = this.generateMockPoll(id);
    } else if (type === 'event') {
      event = this.generateMockEvent(id);
    } else if (type === 'article') {
      article = this.generateMockArticle(id);
    }

    return {
      id,
      type,
      author: this.generateMockUser(id),
      content: contents[parseInt(id) % contents.length],
      media,
      poll,
      event,
      article,
      metrics: {
        likes: Math.floor(Math.random() * 500) + 10,
        retweets: Math.floor(Math.random() * 200) + 5,
        comments: Math.floor(Math.random() * 100) + 2,
        views: Math.floor(Math.random() * 5000) + 500,
      },
      interactions: {
        isLiked: Math.random() > 0.8,
        isRetweeted: Math.random() > 0.9,
        isBookmarked: Math.random() > 0.95,
      },
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
      hashtags: ['#coding', '#webdev', '#tech', '#programming'].slice(0, Math.floor(Math.random() * 3) + 1),
      mentions: ['@maria_design', '@david_tech', '@team'].slice(0, Math.floor(Math.random() * 2)),
    };
  }

  static async fetchFeed(page: number = 0, pageSize: number = 10): Promise<FeedItem[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    const items: FeedItem[] = [];
    const startId = page * pageSize;
    
    for (let i = 0; i < pageSize; i++) {
      const postId = (startId + i).toString();
      items.push({
        id: `feed_${postId}`,
        post: this.generateMockPost(postId),
        feedType: i % 10 === 0 ? 'promoted' : (i % 5 === 0 ? 'trending' : 'timeline'),
        insertedAt: new Date(),
      });
    }
    
    return items;
  }

  static async toggleLike(postId: string): Promise<boolean> {
    
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    return Math.random() > 0.1; 
  }

  static async toggleRetweet(postId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    return Math.random() > 0.1;
  }

  static async toggleBookmark(postId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    return Math.random() > 0.05; 
  }
}