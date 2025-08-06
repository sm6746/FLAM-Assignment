

import { 
  Song, 
  PlayerState, 
  PlaybackState, 
  PlayerObserver, 
  ProgressInfo,
  MusicSource,
  MusicSourceType 
} from '@/types/music';
import { DefaultMusicSourceFactory } from './MusicSourceFactory';

export class MusicPlayerService {
  private static instance: MusicPlayerService;
  private observers: Set<PlayerObserver> = new Set();
  private currentSource: MusicSource | null = null;
  private factory = DefaultMusicSourceFactory.getInstance();
  private progressInterval: number | null = null;
  
  private state: PlayerState = {
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
  };

  
  static getInstance(): MusicPlayerService {
    if (!MusicPlayerService.instance) {
      MusicPlayerService.instance = new MusicPlayerService();
    }
    return MusicPlayerService.instance;
  }

  private constructor() {
    this.setupProgressTracking();
  }

  
  subscribe(observer: PlayerObserver): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: PlayerObserver): void {
    this.observers.delete(observer);
  }

  private notifyStateChange(): void {
    this.observers.forEach(observer => observer.onStateChange({ ...this.state }));
  }

  private notifyProgressUpdate(): void {
    const progress: ProgressInfo = {
      currentTime: this.state.currentTime,
      duration: this.state.duration,
      percentage: this.state.duration > 0 ? (this.state.currentTime / this.state.duration) * 100 : 0
    };
    this.observers.forEach(observer => observer.onProgressUpdate(progress));
  }

  private notifyError(error: string): void {
    this.observers.forEach(observer => observer.onError(error));
  }


  private setupProgressTracking(): void {
    this.progressInterval = window.setInterval(() => {
      if (this.currentSource && this.state.isPlaying) {
        const audio = (this.currentSource as any).audio as HTMLAudioElement;
        if (audio && !isNaN(audio.currentTime) && !isNaN(audio.duration)) {
          this.state.currentTime = audio.currentTime;
          this.state.duration = audio.duration;
          this.notifyProgressUpdate();
        }
      }
    }, 1000);
  }

  
  private async switchToSource(sourceType: MusicSourceType): Promise<void> {
    if (this.currentSource?.type === sourceType) return;

    
    if (this.currentSource) {
      await this.currentSource.cleanup();
    }

    
    this.currentSource = this.factory.createSource(sourceType);
    await this.currentSource.initialize();
    this.setupAudioEvents();
  }

  private setupAudioEvents(): void {
    if (!this.currentSource) return;

    const audio = (this.currentSource as any).audio as HTMLAudioElement;
    if (!audio) return;

    audio.addEventListener('loadedmetadata', () => {
      this.state.duration = audio.duration;
      this.notifyStateChange();
    });

    audio.addEventListener('ended', () => {
      this.handleSongEnd();
    });

    audio.addEventListener('error', (e) => {
      this.notifyError(`Playback error: ${e.message || 'Unknown error'}`);
      this.state.playbackState = PlaybackState.STOPPED;
      this.state.isPlaying = false;
      this.notifyStateChange();
    });

    audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.playbackState = PlaybackState.PLAYING;
      this.notifyStateChange();
    });

    audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.state.playbackState = PlaybackState.PAUSED;
      this.notifyStateChange();
    });
  }

 
  async playSong(song: Song, index?: number): Promise<void> {
    try {
      this.state.playbackState = PlaybackState.LOADING;
      this.notifyStateChange();

      await this.switchToSource(song.source);
      
      this.state.currentSong = song;
      this.state.currentIndex = index ?? this.state.currentIndex;
      
      if (this.currentSource) {
        await this.currentSource.play(song);
      }
    } catch (error) {
      this.notifyError(`Failed to play song: ${error}`);
    }
  }

  async pause(): Promise<void> {
    if (this.currentSource && this.state.isPlaying) {
      await this.currentSource.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.currentSource && !this.state.isPlaying) {
      await this.currentSource.resume();
    }
  }

  async stop(): Promise<void> {
    if (this.currentSource) {
      await this.currentSource.stop();
      this.state.playbackState = PlaybackState.STOPPED;
      this.state.currentTime = 0;
      this.notifyStateChange();
    }
  }

  async seek(time: number): Promise<void> {
    if (this.currentSource) {
      await this.currentSource.seek(time);
      this.state.currentTime = time;
      this.notifyProgressUpdate();
    }
  }

  async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.state.volume = clampedVolume;
    
    if (this.currentSource) {
      await this.currentSource.setVolume(clampedVolume);
    }
    this.notifyStateChange();
  }

  
  setQueue(songs: Song[]): void {
    this.state.queue = [...songs];
    this.notifyStateChange();
  }

  addToQueue(song: Song): void {
    this.state.queue.push(song);
    this.notifyStateChange();
  }

  removeFromQueue(index: number): void {
    if (index >= 0 && index < this.state.queue.length) {
      this.state.queue.splice(index, 1);
      if (this.state.currentIndex > index) {
        this.state.currentIndex--;
      }
      this.notifyStateChange();
    }
  }

  async playNext(): Promise<void> {
    const nextIndex = this.getNextIndex();
    if (nextIndex !== -1 && this.state.queue[nextIndex]) {
      await this.playSong(this.state.queue[nextIndex], nextIndex);
    }
  }

  async playPrevious(): Promise<void> {
    const prevIndex = this.getPreviousIndex();
    if (prevIndex !== -1 && this.state.queue[prevIndex]) {
      await this.playSong(this.state.queue[prevIndex], prevIndex);
    }
  }

  private getNextIndex(): number {
    if (this.state.queue.length === 0) return -1;
    
    if (this.state.repeat === 'one') {
      return this.state.currentIndex;
    }
    
    if (this.state.shuffle) {
      return Math.floor(Math.random() * this.state.queue.length);
    }
    
    const nextIndex = this.state.currentIndex + 1;
    if (nextIndex >= this.state.queue.length) {
      return this.state.repeat === 'all' ? 0 : -1;
    }
    
    return nextIndex;
  }

  private getPreviousIndex(): number {
    if (this.state.queue.length === 0) return -1;
    
    if (this.state.repeat === 'one') {
      return this.state.currentIndex;
    }
    
    if (this.state.shuffle) {
      return Math.floor(Math.random() * this.state.queue.length);
    }
    
    const prevIndex = this.state.currentIndex - 1;
    if (prevIndex < 0) {
      return this.state.repeat === 'all' ? this.state.queue.length - 1 : -1;
    }
    
    return prevIndex;
  }

  private async handleSongEnd(): Promise<void> {
    const nextIndex = this.getNextIndex();
    if (nextIndex !== -1) {
      await this.playSong(this.state.queue[nextIndex], nextIndex);
    } else {
      this.state.isPlaying = false;
      this.state.playbackState = PlaybackState.STOPPED;
      this.notifyStateChange();
    }
  }

  
  toggleShuffle(): void {
    this.state.shuffle = !this.state.shuffle;
    this.notifyStateChange();
  }

  cycleRepeat(): void {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(this.state.repeat);
    this.state.repeat = modes[(currentIndex + 1) % modes.length];
    this.notifyStateChange();
  }

  
  async search(query: string, sourceType?: MusicSourceType): Promise<Song[]> {
    const results: Song[] = [];
    
    if (sourceType) {
      const source = this.factory.createSource(sourceType);
      await source.initialize();
      const songs = await source.search(query);
      results.push(...songs);
    } else {
     
      const sourceTypes = this.factory.getAvailableSourceTypes();
      for (const type of sourceTypes) {
        try {
          const source = this.factory.createSource(type);
          await source.initialize();
          const songs = await source.search(query);
          results.push(...songs);
        } catch (error) {
          console.warn(`Search failed for ${type}:`, error);
        }
      }
    }
    
    return results;
  }

  async getRecommendations(): Promise<Song[]> {
    const recommendations: Song[] = [];
    const sourceTypes = this.factory.getAvailableSourceTypes();
    
    for (const type of sourceTypes) {
      try {
        const source = this.factory.createSource(type);
        await source.initialize();
        const songs = await source.getRecommendations();
        recommendations.push(...songs);
      } catch (error) {
        console.warn(`Recommendations failed for ${type}:`, error);
      }
    }
    
    return recommendations;
  }

  
  getState(): PlayerState {
    return { ...this.state };
  }

  getCurrentSong(): Song | null {
    return this.state.currentSong;
  }

  isPlaying(): boolean {
    return this.state.isPlaying;
  }

  
  async cleanup(): Promise<void> {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    
    if (this.currentSource) {
      await this.currentSource.cleanup();
      this.currentSource = null;
    }
    
    await this.factory.cleanup();
    this.observers.clear();
  }
}