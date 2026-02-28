import { supabase } from '@/integrations/supabase/client';
import { PlayerCosmetics } from './cosmetics';
import { GAME_CONFIG } from './gameConfig';

const syncCache = new Map<string, { timestamp: number; promise: Promise<{ success: boolean; error?: string }> }>();
const CACHE_TTL = GAME_CONFIG.LEADERBOARD_CACHE_TTL;

let batchQueue: Array<{ playerName: string; totalScore: number; cosmetics: PlayerCosmetics }> = [];
let batchTimeout: NodeJS.Timeout | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (batchQueue.length > 0) {
      processBatch();
    }
  });
}

export function clearLeaderboardCache() {
  syncCache.clear();
  batchQueue = [];
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
}

async function processBatch() {
  if (batchQueue.length === 0) return;
  
  const batch = [...batchQueue];
  batchQueue = [];
  
  const uniqueUpdates = new Map<string, typeof batch[0]>();
  batch.forEach(item => {
    uniqueUpdates.set(item.playerName, item);
  });
  
  await Promise.all(
    Array.from(uniqueUpdates.values()).map(item =>
      performSync(item.playerName, item.totalScore, item.cosmetics)
    )
  );
}

export async function syncToLeaderboard(
  playerName: string, 
  totalScore: number, 
  cosmetics: PlayerCosmetics
): Promise<{ success: boolean; error?: string }> {
  if (!playerName) {
    return { success: false, error: 'No player name' };
  }

  const cacheKey = `${playerName}-${totalScore}-${cosmetics.badge}-${cosmetics.frame}-${cosmetics.nameEffect}`;
  const cached = syncCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.promise;
  }

  batchQueue.push({ playerName, totalScore, cosmetics });
  
  if (batchTimeout) clearTimeout(batchTimeout);
  batchTimeout = setTimeout(processBatch, GAME_CONFIG.SYNC_BATCH_DELAY);

  const syncPromise = performSync(playerName, totalScore, cosmetics);
  syncCache.set(cacheKey, { timestamp: Date.now(), promise: syncPromise });

  setTimeout(() => syncCache.delete(cacheKey), CACHE_TTL);

  return syncPromise;
}

async function performSync(
  playerName: string,
  totalScore: number,
  cosmetics: PlayerCosmetics
): Promise<{ success: boolean; error?: string }> {
  const maxRetries = 3;
  let lastError: Error | unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .upsert({
          player_name: playerName,
          total_score: totalScore,
          badge: cosmetics.badge || 'none',
          frame: cosmetics.frame || 'none',
          name_effect: cosmetics.nameEffect || 'none',
        }, {
          onConflict: 'player_name',
          ignoreDuplicates: false
        })
        .select();
      
      if (error) throw error;
      return { success: true };
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  console.error('Leaderboard sync failed after retries:', lastError);
  return { success: false, error: String(lastError) };
}
