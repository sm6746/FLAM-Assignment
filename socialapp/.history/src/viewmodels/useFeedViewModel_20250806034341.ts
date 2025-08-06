
import { useState, useCallback, useEffect, useRef } from 'react';
import { Post, FeedItem, PostOperations } from '../models/Post';
import { FeedService } from '../services/FeedService';
import { Subject, useSubject, debounce } from '../services/ObservableService';
import { PluginService } from '../services/PluginService';

export interface FeedState {
  items: FeedItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  lastRefresh: Date | null;
}

export interface FeedActions {
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  toggleRetweet: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  votePoll: (postId: string, optionId: string) => Promise<void>;
  toggleEventAttendance: (postId: string) => Promise<void>;
  retry: () => Promise<void>;
}

export interface FeedViewModel {
  state: FeedState;
  actions: FeedActions;
  
  isOnline: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const INITIAL_STATE: FeedState = {
  items: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  hasMore: true,
  lastRefresh: null,
};

export function useFeedViewModel(): FeedViewModel {
  const [state, setState] = useState<FeedState>(INITIAL_STATE);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, searchSubject] = useSubject('');
  
  const currentPageRef = useRef(0);
  const isInitializedRef = useRef(false);


  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  useEffect(() => {
    const debouncedSearch = debounce(searchSubject, 300);
    const subscription = debouncedSearch.subscribe((query) => {
      if (query.trim()) {
   
        console.log('Searching for:', query);
      }
    });
    
    return subscription;
  }, [searchSubject]);

  const updateState = useCallback((updater: (prev: FeedState) => FeedState) => {
    setState(updater);
  }, []);

  const handleError = useCallback((error: Error, context: string) => {
    console.error(`Feed error in ${context}:`, error);
    updateState(prev => ({
      ...prev,
      error: `Failed to ${context}. Please try again.`,
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false,
    }));
  }, [updateState]);

  const calculateItemHeight = useCallback((item: FeedItem): number => {
   
    const pluginHeight = PluginService.calculateHeight(item.post);
    if (pluginHeight !== undefined) {
      return pluginHeight;
    }
    
    
    return PostOperations.calculateContentHeight(item.post);
  }, []);

  const loadFeedPage = useCallback(async (page: number, append: boolean = false) => {
    try {
      const newItems = await FeedService.fetchFeed(page, 10);
 
      const itemsWithHeights = newItems.map(item => ({
        ...item,
        height: calculateItemHeight(item),
      }));
      
      updateState(prev => ({
        ...prev,
        items: append ? [...prev.items, ...itemsWithHeights] : itemsWithHeights,
        hasMore: newItems.length === 10, 
        error: null,
        lastRefresh: append ? prev.lastRefresh : new Date(),
      }));
      
      return newItems;
    } catch (error) {
      throw new Error(`load page ${page}`);
    }
  }, [updateState, calculateItemHeight]);

  const refresh = useCallback(async () => {
    if (state.isRefreshing || !isOnline) return;
    
    updateState(prev => ({ ...prev, isRefreshing: true, error: null }));
    
    try {
      currentPageRef.current = 0;
      await loadFeedPage(0, false);
    } catch (error) {
      handleError(error as Error, 'refresh');
    } finally {
      updateState(prev => ({ ...prev, isRefreshing: false }));
    }
  }, [state.isRefreshing, isOnline, updateState, loadFeedPage, handleError]);

  const loadMore = useCallback(async () => {
    if (state.isLoadingMore || !state.hasMore || !isOnline) return;
    
    updateState(prev => ({ ...prev, isLoadingMore: true, error: null }));
    
    try {
      currentPageRef.current += 1;
      await loadFeedPage(currentPageRef.current, true);
    } catch (error) {
      handleError(error as Error, 'load more');
      currentPageRef.current -= 1; // Rollback page increment
    } finally {
      updateState(prev => ({ ...prev, isLoadingMore: false }));
    }
  }, [state.isLoadingMore, state.hasMore, isOnline, updateState, loadFeedPage, handleError]);

  const updatePostInState = useCallback((postId: string, updater: (post: Post) => Post) => {
    updateState(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.post.id === postId) {
          const updatedPost = updater(item.post);
          return { 
            ...item, 
            post: updatedPost,
            height: calculateItemHeight({ ...item, post: updatedPost })
          };
        }
        return item;
      }),
    }));
  }, [updateState, calculateItemHeight]);

  const toggleLike = useCallback(async (postId: string) => {
    if (!isOnline) return;
    
    // Optimistic update
    updatePostInState(postId, PostOperations.toggleLike);
    
    try {
      await FeedService.toggleLike(postId);
    } catch (error) {
      // Rollback on failure
      updatePostInState(postId, PostOperations.toggleLike);
      console.error('Failed to toggle like:', error);
    }
  }, [isOnline, updatePostInState]);

  const toggleRetweet = useCallback(async (postId: string) => {
    if (!isOnline) return;
    
    updatePostInState(postId, PostOperations.toggleRetweet);
    
    try {
      await FeedService.toggleRetweet(postId);
    } catch (error) {
      updatePostInState(postId, PostOperations.toggleRetweet);
      console.error('Failed to toggle retweet:', error);
    }
  }, [isOnline, updatePostInState]);

  const toggleBookmark = useCallback(async (postId: string) => {
    if (!isOnline) return;
    
    updatePostInState(postId, PostOperations.toggleBookmark);
    
    try {
      await FeedService.toggleBookmark(postId);
    } catch (error) {
      updatePostInState(postId, PostOperations.toggleBookmark);
      console.error('Failed to toggle bookmark:', error);
    }
  }, [isOnline, updatePostInState]);

  const votePoll = useCallback(async (postId: string, optionId: string) => {
    if (!isOnline) return;
    
    // Optimistic update
    updatePostInState(postId, (post) => PostOperations.votePoll(post, optionId));
    
    try {
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      // Rollback on failure
      updatePostInState(postId, (post) => PostOperations.votePoll(post, optionId));
      console.error('Failed to vote on poll:', error);
    }
  }, [isOnline, updatePostInState]);

  const toggleEventAttendance = useCallback(async (postId: string) => {
    if (!isOnline) return;
    
    // Optimistic update
    updatePostInState(postId, PostOperations.toggleEventAttendance);
    
    try {
      // In real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      // Rollback on failure
      updatePostInState(postId, PostOperations.toggleEventAttendance);
      console.error('Failed to toggle event attendance:', error);
    }
  }, [isOnline, updatePostInState]);

  const retry = useCallback(async () => {
    updateState(prev => ({ ...prev, error: null }));
    await refresh();
  }, [refresh, updateState]);

  // Initial load
  useEffect(() => {
    if (!isInitializedRef.current && isOnline) {
      isInitializedRef.current = true;
      updateState(prev => ({ ...prev, isLoading: true }));
      
      loadFeedPage(0, false)
        .then(() => {
          updateState(prev => ({ ...prev, isLoading: false }));
        })
        .catch((error) => {
          handleError(error as Error, 'initial load');
        });
    }
  }, [isOnline, updateState, loadFeedPage, handleError]);

  const setSearchQuery = useCallback((query: string) => {
    searchSubject.emit(query);
  }, [searchSubject]);

  return {
    state,
    actions: {
      refresh,
      loadMore,
      toggleLike,
      toggleRetweet,
      toggleBookmark,
      votePoll,
      toggleEventAttendance,
      retry,
    },
    isOnline,
    searchQuery,
    setSearchQuery,
  };
}