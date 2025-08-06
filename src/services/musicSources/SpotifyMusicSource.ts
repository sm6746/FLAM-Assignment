
import { MusicSource, MusicSourceType, Song } from '@/types/music';

export class SpotifyMusicSource implements MusicSource {
  readonly type = MusicSourceType.SPOTIFY;
  private audioElement: HTMLAudioElement | null = null;
  private isInitialized = false;
  private accessToken: string | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';
    this.accessToken = 'mock-spotify-token';
    this.isInitialized = true;
    
    console.log('Spotify source initialized');
  }

  async play(song: Song): Promise<void> {
    if (!this.audioElement) throw new Error('Spotify source not initialized');
    
    
    const playUrl = song.preview || song.url;
    if (!playUrl) {
      throw new Error('No preview available for this Spotify track');
    }
    
    if (this.audioElement.src !== playUrl) {
      this.audioElement.src = playUrl;
      this.audioElement.load();
    }
    
    try {
      await this.audioElement.play();
    } catch (error) {
      throw new Error(`Failed to play Spotify track: ${error}`);
    }
  }

  async pause(): Promise<void> {
    if (!this.audioElement) throw new Error('Spotify source not initialized');
    this.audioElement.pause();
  }

  async resume(): Promise<void> {
    if (!this.audioElement) throw new Error('Spotify source not initialized');
    await this.audioElement.play();
  }

  async stop(): Promise<void> {
    if (!this.audioElement) throw new Error('Spotify source not initialized');
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  async seek(time: number): Promise<void> {
    if (!this.audioElement) throw new Error('Spotify source not initialized');
    this.audioElement.currentTime = time;
  }

  async setVolume(volume: number): Promise<void> {
    if (!this.audioElement) throw new Error('Spotify source not initialized');
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  async search(query: string): Promise<Song[]> {
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSpotifyResults: Song[] = [
        {
          id: 'spotify-1',
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          duration: 200,
          source: MusicSourceType.SPOTIFY,
          imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
          preview: 'https://p.scdn.co/mp3-preview/9df8c4b6e8e1eb686d7dfce7cb3b7b6c48c9b1ae'
        },
        {
          id: 'spotify-2',
          title: 'Shape of You',
          artist: 'Ed Sheeran',
          album: '÷ (Divide)',
          duration: 233,
          source: MusicSourceType.SPOTIFY,
          imageUrl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
          preview: 'https://p.scdn.co/mp3-preview/c6f3c05a8e2c7e6d7a9a8b5e4d3c2b1a0f9e8d7c'
        },
        {
          id: 'spotify-3',
          title: 'Watermelon Sugar',
          artist: 'Harry Styles',
          album: 'Fine Line',
          duration: 174,
          source: MusicSourceType.SPOTIFY,
          imageUrl: 'https://i.scdn.co/image/ab67616d0000b273f7db43292a6a99b21b51d5b4',
          preview: 'https://p.scdn.co/mp3-preview/b4c3f6a7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3'
        }
      ];

      return mockSpotifyResults.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        song.album.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Spotify search error:', error);
      return [];
    }
  }

  async getRecommendations(): Promise<Song[]> {
    
    return [
      {
        id: 'spotify-rec-1',
        title: 'As It Was',
        artist: 'Harry Styles',
        album: "Harry's House",
        duration: 167,
        source: MusicSourceType.SPOTIFY,
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273f7db43292a6a99b21b51d5b4',
        preview: 'https://p.scdn.co/mp3-preview/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
      },
      {
        id: 'spotify-rec-2',
        title: 'Anti-Hero',
        artist: 'Taylor Swift',
        album: 'Midnights',
        duration: 200,
        source: MusicSourceType.SPOTIFY,
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5',
        preview: 'https://p.scdn.co/mp3-preview/z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0'
      }
    ];
  }

  async cleanup(): Promise<void> {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }
    this.accessToken = null;
    this.isInitialized = false;
  }

  
  get audio(): HTMLAudioElement | null {
    return this.audioElement;
  }
}