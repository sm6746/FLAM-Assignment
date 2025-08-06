import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Song, PlayerState, PlaybackState, PlayerObserver, ProgressInfo } from '@/types/music';
import { MusicPlayerService } from '@/services/MusicPlayerService';

interface MusicPlayerContextType {
  state: PlayerState;
  progress: ProgressInfo;
  error: string | null;
  // Actions
  playSong: (song: Song, index?: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  setQueue: (songs: Song[]) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  search: (query: string) => Promise<Song[]>;
  getRecommendations: () => Promise<Song[]>;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

interface State {
  playerState: PlayerState;
  progress: ProgressInfo;
  error: string | null;
}

type Action = 
  | { type: 'SET_PLAYER_STATE'; payload: PlayerState }
  | { type: 'SET_PROGRESS'; payload: ProgressInfo }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: State = {
  playerState: {
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    playbackState: PlaybackState.STOPPED,
    queue: [],
    currentIndex: -1,
    shuffle: false,
    repeat: 'none'
  },
  progress: {
    currentTime: 0,
    duration: 0,
    percentage: 0
  },
  error: null
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PLAYER_STATE':
      return { ...state, playerState: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface MusicPlayerProviderProps {
  children: React.ReactNode;
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const playerService = MusicPlayerService.getInstance();

  useEffect(() => {
    // Create observer for player service
    const observer: PlayerObserver = {
      onStateChange: (playerState: PlayerState) => {
        dispatch({ type: 'SET_PLAYER_STATE', payload: playerState });
      },
      onProgressUpdate: (progress: ProgressInfo) => {
        dispatch({ type: 'SET_PROGRESS', payload: progress });
      },
      onError: (error: string) => {
        dispatch({ type: 'SET_ERROR', payload: error });
        // Clear error after 5 seconds
        setTimeout(() => {
          dispatch({ type: 'SET_ERROR', payload: null });
        }, 5000);
      }
    };

    // Subscribe to player service
    playerService.subscribe(observer);

    // Initial state sync
    dispatch({ type: 'SET_PLAYER_STATE', payload: playerService.getState() });

    // Cleanup on unmount
    return () => {
      playerService.unsubscribe(observer);
    };
  }, [playerService]);

  const contextValue: MusicPlayerContextType = {
    state: state.playerState,
    progress: state.progress,
    error: state.error,
    
    playSong: async (song: Song, index?: number) => {
      dispatch({ type: 'SET_ERROR', payload: null });
      await playerService.playSong(song, index);
    },
    
    pause: async () => {
      await playerService.pause();
    },
    
    resume: async () => {
      await playerService.resume();
    },
    
    stop: async () => {
      await playerService.stop();
    },
    
    seek: async (time: number) => {
      await playerService.seek(time);
    },
    
    setVolume: async (volume: number) => {
      await playerService.setVolume(volume);
    },
    
    playNext: async () => {
      await playerService.playNext();
    },
    
    playPrevious: async () => {
      await playerService.playPrevious();
    },
    
    setQueue: (songs: Song[]) => {
      playerService.setQueue(songs);
    },
    
    addToQueue: (song: Song) => {
      playerService.addToQueue(song);
    },
    
    removeFromQueue: (index: number) => {
      playerService.removeFromQueue(index);
    },
    
    toggleShuffle: () => {
      playerService.toggleShuffle();
    },
    
    cycleRepeat: () => {
      playerService.cycleRepeat();
    },
    
    search: async (query: string) => {
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        return await playerService.search(query);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: `Search failed: ${error}` });
        return [];
      }
    },
    
    getRecommendations: async () => {
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        return await playerService.getRecommendations();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: `Failed to get recommendations: ${error}` });
        return [];
      }
    }
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}