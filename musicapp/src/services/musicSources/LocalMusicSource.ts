

import { MusicSource, MusicSourceType, Song } from '@/types/music';

export class LocalMusicSource implements MusicSource {
  readonly type = MusicSourceType.LOCAL;
  private audioElement: HTMLAudioElement | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';
    this.isInitialized = true;
    
    console.log('Local music source initialized');
  }

  async play(song: Song): Promise<void> {
    if (!this.audioElement) throw new Error('Local source not initialized');
    
    if (this.audioElement.src !== song.url) {
      this.audioElement.src = song.url || '';
      this.audioElement.load();
    }
    
    try {
      await this.audioElement.play();
    } catch (error) {
      throw new Error(`Failed to play local file: ${error}`);
    }
  }

  async pause(): Promise<void> {
    if (!this.audioElement) throw new Error('Local source not initialized');
    this.audioElement.pause();
  }

  async resume(): Promise<void> {
    if (!this.audioElement) throw new Error('Local source not initialized');
    await this.audioElement.play();
  }

  async stop(): Promise<void> {
    if (!this.audioElement) throw new Error('Local source not initialized');
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  async seek(time: number): Promise<void> {
    if (!this.audioElement) throw new Error('Local source not initialized');
    this.audioElement.currentTime = time;
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.audioElement) throw new Error('Local source not initialized');
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  async search(query: string): Promise<Song[]> {
   
    const mockLocalSongs: Song[] = [
      {
        id: 'local-1',
        title: 'Local Song 1',
        artist: 'Local Artist',
        album: 'Local Album',
        duration: 210,
        source: MusicSourceType.LOCAL,
        imageUrl: '/placeholder.svg'
      },
      {
        id: 'local-2',
        title: 'Another Local Track',
        artist: 'Indie Artist',
        album: 'Demo Album',
        duration: 185,
        source: MusicSourceType.LOCAL,
        imageUrl: '/placeholder.svg'
      }
    ];

    return mockLocalSongs.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getRecommendations(): Promise<Song[]> {
    
    return [
      {
        id: 'local-rec-1',
        title: 'Recommended Local Track',
        artist: 'Featured Artist',
        album: 'Best of Local',
        duration: 200,
        source: MusicSourceType.LOCAL,
        imageUrl: '/placeholder.svg'
      }
    ];
  }

  async cleanup(): Promise<void> {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    this.isInitialized = false;
  }

  
  get audio(): HTMLAudioElement | null {
    return this.audioElement;
  }
}