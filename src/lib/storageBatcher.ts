import { GAME_CONFIG } from './gameConfig';

type StorageUpdate = {
  key: string;
  value: string;
};

class LocalStorageBatcher {
  private queue: Map<string, string> = new Map();
  private timeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = GAME_CONFIG.STORAGE_BATCH_DELAY;

  set(key: string, value: string, immediate = false) {
    if (immediate) {
      this.flush();
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error('Failed to write to localStorage:', err);
      }
      return;
    }

    this.queue.set(key, value);
    this.scheduleBatch();
  }

  private scheduleBatch() {
    if (this.timeout) clearTimeout(this.timeout);
    
    this.timeout = setTimeout(() => {
      this.flush();
    }, this.BATCH_DELAY);
  }

  flush() {
    if (this.queue.size === 0) return;

    try {
      this.queue.forEach((value, key) => {
        localStorage.setItem(key, value);
      });
      this.queue.clear();
    } catch (err) {
      console.error('Failed to batch write to localStorage:', err);
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  setupUnloadHandler() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
      
      // Also flush on visibility change (tab switch)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flush();
        }
      });
    }
  }
}

export const storageBatcher = new LocalStorageBatcher();
storageBatcher.setupUnloadHandler();
