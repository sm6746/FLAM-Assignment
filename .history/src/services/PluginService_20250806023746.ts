import { FeedItemPlugin, Post, PostType } from '../models/Post';

// Plugin registry for custom feed items
class PluginRegistry {
  private plugins: Map<string, FeedItemPlugin> = new Map();
  private typePlugins: Map<PostType, FeedItemPlugin[]> = new Map();

  register(plugin: FeedItemPlugin): void {
    this.plugins.set(plugin.id, plugin);
    
    if (!this.typePlugins.has(plugin.type)) {
      this.typePlugins.set(plugin.type, []);
    }
    this.typePlugins.get(plugin.type)!.push(plugin);
  }

  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      this.plugins.delete(pluginId);
      const typePlugins = this.typePlugins.get(plugin.type);
      if (typePlugins) {
        const index = typePlugins.findIndex(p => p.id === pluginId);
        if (index > -1) {
          typePlugins.splice(index, 1);
        }
      }
    }
  }

  getPlugin(pluginId: string): FeedItemPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getPluginsForType(type: PostType): FeedItemPlugin[] {
    return this.typePlugins.get(type) || [];
  }

  getAllPlugins(): FeedItemPlugin[] {
    return Array.from(this.plugins.values());
  }

  validatePost(post: Post): boolean {
    const plugins = this.getPluginsForType(post.type);
    return plugins.some(plugin => plugin.validate(post));
  }

  renderPost(post: Post): React.ReactNode | null {
    const plugins = this.getPluginsForType(post.type);
    const validPlugin = plugins.find(plugin => plugin.validate(post));
    return validPlugin ? validPlugin.render(post) : null;
  }

  calculateHeight(post: Post): number | undefined {
    const plugins = this.getPluginsForType(post.type);
    const validPlugin = plugins.find(plugin => plugin.validate(post));
    return validPlugin?.getHeight?.(post);
  }
}

// Global plugin registry instance
export const pluginRegistry = new PluginRegistry();

// Plugin service for managing plugins
export class PluginService {
  static registerPlugin(plugin: FeedItemPlugin): void {
    pluginRegistry.register(plugin);
  }

  static unregisterPlugin(pluginId: string): void {
    pluginRegistry.unregister(pluginId);
  }

  static getPlugin(pluginId: string): FeedItemPlugin | undefined {
    return pluginRegistry.getPlugin(pluginId);
  }

  static getPluginsForType(type: PostType): FeedItemPlugin[] {
    return pluginRegistry.getPluginsForType(type);
  }

  static getAllPlugins(): FeedItemPlugin[] {
    return pluginRegistry.getAllPlugins();
  }

  static validatePost(post: Post): boolean {
    return pluginRegistry.validatePost(post);
  }

  static renderPost(post: Post): React.ReactNode | null {
    return pluginRegistry.renderPost(post);
  }

  static calculateHeight(post: Post): number | undefined {
    return pluginRegistry.calculateHeight(post);
  }

  // Helper method to check if a post type has custom rendering
  static hasCustomRenderer(type: PostType): boolean {
    return pluginRegistry.getPluginsForType(type).length > 0;
  }
} 