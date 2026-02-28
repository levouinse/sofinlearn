import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';

interface Props {
  lang: Language;
  score: number;
  onRetry: () => void;
  onMainMenu: () => void;
}

export default function GameOver({ lang, score, onRetry, onMainMenu }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      <div className="border border-destructive bg-card p-8 rounded w-full max-w-sm text-center">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="font-pixel text-2xl text-destructive mb-4">
          GAME OVER
        </h2>
        <p className="text-muted-foreground font-pixel text-xs mb-6">
          {t('health', lang)}: 0
        </p>

        <div className="text-center mb-6">
          <p className="font-pixel text-xs text-muted-foreground">{t('score', lang)}</p>
          <p className="font-pixel text-3xl text-primary">{score}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { playSfx('click'); onRetry(); }}
            className="w-full py-3 border border-primary text-primary font-pixel text-xs
              hover:bg-primary hover:text-primary-foreground transition-all"
          >
            🔄 Retry Level
          </button>

          <button
            onClick={() => { playSfx('click'); onMainMenu(); }}
            className="w-full py-3 border border-border text-muted-foreground font-pixel text-xs
              hover:border-primary hover:text-primary transition-all"
          >
            {'< '}{t('back', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
