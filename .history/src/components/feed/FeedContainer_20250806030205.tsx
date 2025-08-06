// Main Feed Container - orchestrates the entire feed
import React, { useCallback } from 'react';
import { useFeedViewModel } from '../../viewmodels/useFeedViewModel';
import { FeedHeader } from './FeedHeader';
import { FeedList } from './FeedList';
import { FeedError } from './FeedError';
import { FeedLoading } from './FeedLoading';
import { PullToRefresh } from './PullToRefresh';

export const FeedContainer: React.FC = () => {
  const viewModel = useFeedViewModel();
  const { state, actions, isOnline, searchQuery, setSearchQuery } = viewModel;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const threshold = 100; // Load more when 100px from bottom
    
    if (scrollHeight - scrollTop - clientHeight < threshold && !state.isLoadingMore && state.hasMore) {
      actions.loadMore();
    }
  }, [actions, state.isLoadingMore, state.hasMore]);

  if (state.isLoading && state.items.length === 0) {
    return (
      <div className="min-h-screen bg-feed-bg">
        <FeedHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isOnline={isOnline}
        />
        <FeedLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-feed-bg">
      <FeedHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isOnline={isOnline}
      />
      
      <main className="max-w-2xl mx-auto">
        <PullToRefresh
          isRefreshing={state.isRefreshing}
          onRefresh={actions.refresh}
          disabled={!isOnline}
        >
          <div 
            className="overflow-auto custom-scrollbar scroll-smooth"
            onScroll={handleScroll}
            style={{ height: 'calc(100vh - 80px)' }}
          >
            {state.error ? (
              <FeedError 
                message={state.error}
                onRetry={actions.retry}
                isOnline={isOnline}
              />
            ) : (
              <FeedList
                items={state.items}
                onLike={actions.toggleLike}
                onRetweet={actions.toggleRetweet}
                onBookmark={actions.toggleBookmark}
                onVotePoll={actions.votePoll}
                onToggleEventAttendance={actions.toggleEventAttendance}
                isLoadingMore={state.isLoadingMore}
                hasMore={state.hasMore}
                isOnline={isOnline}
              />
            )}
          </div>
        </PullToRefresh>
      </main>
    </div>
  );
};