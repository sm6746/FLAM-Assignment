

import { MusicSource, MusicSourceFactory, MusicSourceType } from '@/types/music';
import { LocalMusicSource } from './musicSources/LocalMusicSource';
import { SpotifyMusicSource } from './musicSources/SpotifyMusicSource';

export class DefaultMusicSourceFactory implements MusicSourceFactory {
  private static instance: DefaultMusicSourceFactory;
  private sources: Map<MusicSourceType, MusicSource> = new Map();

  
  static getInstance(): DefaultMusicSourceFactory {
    if (!DefaultMusicSourceFactory.instance) {
      DefaultMusicSourceFactory.instance = new DefaultMusicSourceFactory();
    }
    return DefaultMusicSourceFactory.instance;
  }

  createSource(type: MusicSourceType): MusicSource {
    
    if (this.sources.has(type)) {
      return this.sources.get(type)!;
    }

    let source: MusicSource;

    switch (type) {
      case MusicSourceType.LOCAL:
        source = new LocalMusicSource();
        break;
      case MusicSourceType.SPOTIFY:
        source = new SpotifyMusicSource();
        break;
      default:
        throw new Error(`Unsupported music source type: ${type}`);
    }

    this.sources.set(type, source);
    return source;
  }

  
  getAvailableSourceTypes(): MusicSourceType[] {
    return Object.values(MusicSourceType);
  }

  async cleanup(): Promise<void> {
    const cleanupPromises = Array.from(this.sources.values()).map(source => 
      source.cleanup()
    );
    await Promise.all(cleanupPromises);
    this.sources.clear();
  }
}