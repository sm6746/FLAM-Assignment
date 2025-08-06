

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl?: string;
  source: MusicSourceType;
  url?: string;
  preview?: string;
}

export enum MusicSourceType {
  LOCAL = 'local',
  SPOTIFY = 'spotify'
}

export enum PlaybackState {
  STOPPED = 'stopped',
  PLAYING = 'playing',
  PAUSED = 'paused',
  LOADING = 'loading'
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackState: PlaybackState;
  queue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

export interface ProgressInfo {
  currentTime: number;
  duration: number;
  percentage: number;
}

export interface PlayerObserver {
  onStateChange(state: PlayerState): void;
  onProgressUpdate(progress: ProgressInfo): void;
  onError(error: string): void;
}


export interface MusicSource {
  readonly type: MusicSourceType;
  initialize(): Promise<void>;
  play(song: Song): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  seek(time: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  search(query: string): Promise<Song[]>;
  getRecommendations(): Promise<Song[]>;
  cleanup(): Promise<void>;
}


export interface MusicSourceFactory {
  createSource(type: MusicSourceType): MusicSource;
}