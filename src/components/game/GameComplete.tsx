import { useState, useEffect, useCallback } from 'react';
import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { syncToLeaderboard } from '@/lib/leaderboardSync';
import { PlayerCosmetics } from '@/lib/cosmetics';

interface Props {
  lang: Language;
  playerName: string;
  totalScore: number;
  cosmetics: PlayerCosmetics;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
}

export default function GameComplete({ lang, playerName, totalScore, cosmetics, onPlayAgain, onLeaderboard }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (submitted || submitting) return;
    setSubmitting(true);
    
    const result = await syncToLeaderboard(playerName, totalScore, cosmetics);
    
    if (result.success) {
      setSubmitted(true);
      playSfx('levelup');
    } else {
      playSfx('wrong');
    }
    
    setSubmitting(false);
  }, [submitted, submitting, playerName, totalScore, cosmetics]);

  useEffect(() => {
    const submitKey = `submitted_${playerName}_${totalScore}`;
    const alreadySubmitted = sessionStorage.getItem(submitKey);
    
    if (!alreadySubmitted) {
      handleSubmit();
      sessionStorage.setItem(submitKey, 'true');
    } else {
      setSubmitted(true);
    }
  }, [playerName, totalScore, handleSubmit]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      <div className="border border-primary bg-card p-8 rounded glow-border w-full max-w-sm text-center">
        <h2 className="font-pixel text-xl text-primary glow-text mb-4">
          🎉 {t('gameComplete', lang)}
        </h2>
        <p className="text-muted-foreground font-pixel text-[10px] mb-6">
          {t('congratulations', lang)}
        </p>

        <div className="text-center mb-6">
          <p className="font-pixel text-[10px] text-muted-foreground mb-1">💎 {lang === 'id' ? 'Total XP Terkumpul' : 'Total XP Earned'}</p>
          <p className="font-pixel text-3xl text-primary glow-text">{totalScore.toLocaleString()}</p>
          <p className="font-pixel text-[8px] text-accent mt-2">
            {lang === 'id' ? '🏆 Kamu menyelesaikan semua stage!' : '🏆 You completed all stages!'}
          </p>
        </div>

        <div className="space-y-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 border border-primary text-primary font-pixel text-xs
                hover:bg-primary hover:text-primary-foreground transition-all glow-border active:scale-95
                disabled:opacity-50"
            >
              {submitting ? t('submitting', lang) : t('submitScore', lang)}
            </button>
          ) : (
            <p className="font-pixel text-xs text-primary glow-text">✓ {t('submitted', lang)}</p>
          )}

          <button
            onClick={() => { playSfx('click'); onLeaderboard(); }}
            className="w-full py-3 border border-border text-muted-foreground font-pixel text-xs
              hover:border-primary hover:text-primary transition-all active:scale-95"
          >
            {t('leaderboard', lang)}
          </button>

          <button
            onClick={() => { playSfx('click'); onPlayAgain(); }}
            className="w-full py-3 border border-border text-muted-foreground font-pixel text-xs
              hover:border-primary hover:text-primary transition-all active:scale-95"
          >
            {t('playAgain', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

