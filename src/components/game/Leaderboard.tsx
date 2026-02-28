import { useState, useEffect, useCallback, useRef } from 'react';
import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { supabase } from '@/integrations/supabase/client';
import { GAME_CONFIG } from '@/lib/gameConfig';

interface Props {
  lang: Language;
  onBack: () => void;
}

interface LeaderboardEntry {
  id: string;
  player_name: string;
  total_score: number;
  badge?: string;
  frame?: string;
  name_effect?: string;
}

export default function Leaderboard({ lang, onBack }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const cacheRef = useRef<{ data: LeaderboardEntry[]; timestamp: number } | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchLeaderboard = useCallback(async () => {
    if (isFetchingRef.current || !isMountedRef.current) return;
    
    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < GAME_CONFIG.LEADERBOARD_CACHE_TTL) {
      setEntries(cacheRef.current.data);
      setLoading(false);
      return;
    }
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select('id, player_name, total_score, badge, frame, name_effect')
        .order('total_score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      if (data && isMountedRef.current) {
        // Sanitize data to prevent undefined values
        const sanitizedData = data.map(entry => ({
          ...entry,
          badge: entry.badge || 'none',
          frame: entry.frame || 'none',
          name_effect: entry.name_effect || 'none',
        }));
        setEntries(sanitizedData);
        cacheRef.current = { data: sanitizedData, timestamp: Date.now() };
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        isFetchingRef.current = false;
      }
    }
  }, []);

  const debouncedFetch = useCallback(() => {
    cacheRef.current = null;
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const throttledFetch = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  const handleRealtimeUpdate = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < GAME_CONFIG.LEADERBOARD_REALTIME_THROTTLE) {
      return;
    }
    
    if (throttledFetch.current) {
      clearTimeout(throttledFetch.current);
    }
    
    throttledFetch.current = setTimeout(() => {
      lastUpdateRef.current = Date.now();
      debouncedFetch();
      throttledFetch.current = null;
    }, GAME_CONFIG.LEADERBOARD_REALTIME_THROTTLE);
  }, [debouncedFetch]);

  useEffect(() => {
    fetchLeaderboard();
    
    const channel = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'leaderboard' },
        handleRealtimeUpdate
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
      if (throttledFetch.current) {
        clearTimeout(throttledFetch.current);
      }
    };
  }, [fetchLeaderboard, handleRealtimeUpdate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-8">
      <h2 className="font-pixel text-2xl text-primary glow-text mb-2">
        🏆 {t('top10', lang)}
      </h2>
      <p className="font-pixel text-[10px] text-muted-foreground mb-6">
        {lang === 'id' ? 'Top 10 Pemain Terbaik' : 'Top 10 Best Players'}
      </p>

      <div className="w-full max-w-4xl border-2 border-primary bg-card/50 backdrop-blur rounded-lg overflow-hidden glow-border">
        {/* Header */}
        <div className="grid grid-cols-[50px_1fr_80px] sm:grid-cols-[60px_1fr_120px] gap-2 sm:gap-4 p-3 sm:p-4 border-b-2 border-primary bg-gradient-to-r from-primary/30 to-accent/30">
          <span className="font-pixel text-[9px] sm:text-xs text-primary text-center">Rank</span>
          <span className="font-pixel text-[9px] sm:text-xs text-primary">Player</span>
          <span className="font-pixel text-[9px] sm:text-xs text-primary text-right">Score</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="font-pixel text-sm text-primary animate-pulse">Loading...</div>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-pixel text-xs text-muted-foreground mb-2">{t('noScores', lang)}</p>
            <p className="font-pixel text-[10px] text-muted-foreground">{lang === 'id' ? 'Jadilah yang pertama!' : 'Be the first!'}</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {entries.map((entry, idx) => {
              const getBadgeDisplay = (badge: string) => {
                if (badge === 'bronze') return { text: '[B]', color: '#CD7F32' };
                if (badge === 'silver') return { text: '[S]', color: '#C0C0C0' };
                if (badge === 'gold') return { text: '[G]', color: '#FFD700' };
                if (badge === 'diamond') return { text: '[D]', color: '#B9F2FF' };
                if (badge === 'legendary') return { text: '[L]', color: '#FFD700' };
                return null;
              };
              
              const badgeDisplay = getBadgeDisplay(entry.badge || '');
              
              // Safe check: only apply class if valid value exists
              const frameClass = (entry.frame && entry.frame !== 'none' && entry.frame !== '') ? `frame-${entry.frame}` : '';
              const nameClass = (entry.name_effect && entry.name_effect !== 'none' && entry.name_effect !== '') ? `name-${entry.name_effect}` : '';
              
              // Check apakah ada fire atau ice frame untuk particles
              const hasFireFrame = entry.frame === 'fire';
              const hasIceFrame = entry.frame === 'ice';
              
              return (
                <div
                  key={entry.id}
                  className={`grid grid-cols-[50px_1fr_80px] sm:grid-cols-[60px_1fr_120px] gap-2 sm:gap-4 p-2 sm:p-4 border-b border-border/50 transition-all hover:bg-primary/10
                    ${idx < 3 ? 'bg-gradient-to-r from-accent/20 to-primary/20' : 'bg-card/30'}`}
                >
                  <div className="flex items-center justify-center">
                    <span className={`font-pixel ${idx < 3 ? 'text-base sm:text-xl' : 'text-sm sm:text-base'}`}>
                      {idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : `#${idx + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden relative">
                    {badgeDisplay && (
                      <span 
                        className="font-pixel text-sm sm:text-base flex-shrink-0 font-bold"
                        style={{ color: badgeDisplay.color }}
                      >
                        {badgeDisplay.text}
                      </span>
                    )}
                    
                    {/* NAMA PLAYER dengan frame dan name effect */}
                    <div className="relative inline-block">
                      {frameClass ? (
                        <span className={`font-pixel text-sm sm:text-base ${frameClass}`}>
                          <span className={nameClass || 'text-foreground'}>
                            {entry.player_name}
                          </span>
                        </span>
                      ) : (
                        <span className={`font-pixel text-sm sm:text-base ${nameClass || 'text-foreground'}`}>
                          {entry.player_name}
                        </span>
                      )}
                      
                      {/* Fire particles effect - API NAGA NAIK */}
                      {hasFireFrame && (
                        <>
                          <span className="absolute -left-6 top-1/2 text-orange-500 font-bold animate-fire-rise" style={{ animationDelay: '0s' }}>▲</span>
                          <span className="absolute -left-4 top-1/2 text-red-500 font-bold animate-fire-rise" style={{ animationDelay: '0.3s' }}>▲</span>
                          <span className="absolute -right-6 top-1/2 text-orange-500 font-bold animate-fire-rise" style={{ animationDelay: '0.6s' }}>▲</span>
                          <span className="absolute -right-4 top-1/2 text-red-500 font-bold animate-fire-rise" style={{ animationDelay: '0.9s' }}>▲</span>
                        </>
                      )}
                      
                      {/* Ice particles effect - ES BERJATUHAN */}
                      {hasIceFrame && (
                        <>
                          <span className="absolute -left-6 -top-6 text-cyan-400 font-bold animate-ice-fall" style={{ animationDelay: '0s' }}>*</span>
                          <span className="absolute -left-2 -top-6 text-blue-300 font-bold animate-ice-fall" style={{ animationDelay: '0.5s' }}>*</span>
                          <span className="absolute -right-6 -top-6 text-cyan-400 font-bold animate-ice-fall" style={{ animationDelay: '1s' }}>*</span>
                          <span className="absolute -right-2 -top-6 text-blue-300 font-bold animate-ice-fall" style={{ animationDelay: '1.5s' }}>*</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="font-pixel text-[10px] sm:text-sm text-accent">
                      {entry.total_score >= 1000 ? `${(entry.total_score / 1000).toFixed(1)}k` : entry.total_score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => { playSfx('click'); onBack(); }}
        className="mt-8 px-6 py-2 border border-primary text-primary font-pixel text-xs hover:bg-primary hover:text-primary-foreground transition-all"
      >
        {'< '}{t('back', lang)}
      </button>
    </div>
  );
}

