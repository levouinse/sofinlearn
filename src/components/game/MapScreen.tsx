import { t, Language, TranslationKey } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { LEVELS } from '@/lib/gameState';

interface Props {
  lang: Language;
  currentStage: number;
  completedLevels: number[];
  levelStars: Record<number, number>;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export default function MapScreen({ lang, currentStage, completedLevels, levelStars, onSelectLevel, onBack }: Props) {
  const stageLevels = LEVELS.filter(l => l.stage === currentStage);
  const isUnlocked = (id: number) => {
    const levelIndex = stageLevels.findIndex(l => l.id === id);
    return levelIndex === 0 || completedLevels.includes(stageLevels[levelIndex - 1].id);
  };

  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      {/* Back Button - Fixed Top Left */}
      <button
        onClick={() => { playSfx('click'); onBack(); }}
        className="fixed top-4 left-4 z-40 px-4 py-2 border border-primary text-primary font-pixel text-xs
          hover:bg-primary hover:text-primary-foreground transition-all glow-border"
      >
        {'< '}{t('back', lang)}
      </button>

      {/* Header - Fixed */}
      <div className="flex-shrink-0 pt-20 pb-4 px-4 text-center">
        <h2 className="font-pixel text-xl sm:text-2xl text-primary glow-text">
          {t('selectMap', lang)}
        </h2>
      </div>

      {/* Scrollable Map Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="flex flex-col items-center px-4 pb-24">
          {/* Map Path */}
          <div className="relative flex flex-col items-center gap-2 w-full max-w-xs">
          {stageLevels.map((level, idx) => {
          const unlocked = isUnlocked(level.id);
          const completed = completedLevels.includes(level.id);
          const stars = levelStars[level.id] || 0;
          const levelNumber = idx + 1;

          return (
            <div key={level.id} className="flex flex-col items-center">
              {/* Connector line */}
              {idx > 0 && (
                <div className={`w-0.5 h-6 ${completed || unlocked ? 'bg-primary' : 'bg-muted'}`} />
              )}

              {/* Node */}
              <button
                onClick={() => {
                  if (unlocked) { playSfx('click'); onSelectLevel(level.id); }
                }}
                disabled={!unlocked}
                className={`w-full max-w-[220px] py-3 px-4 border rounded text-center transition-all
                  ${unlocked
                    ? completed
                      ? 'border-primary bg-secondary text-primary glow-border'
                      : 'border-primary bg-card text-primary hover:bg-primary hover:text-primary-foreground node-active'
                    : 'border-muted bg-muted/20 text-muted-foreground cursor-not-allowed opacity-50'
                  }`}
              >
                <p className="font-pixel text-[10px] mb-1">
                  {t('level', lang)} {levelNumber}
                </p>
                <p className="font-pixel text-xs">
                  {unlocked ? t(level.topic as TranslationKey, lang) : `🔒 ${t('locked', lang)}`}
                </p>
                {completed && (
                  <div className="mt-1 text-sm">
                    {Array.from({ length: 3 }, (_, i) => (
                      <span key={i} className={i < stars ? 'star-animate' : 'opacity-30'}>⭐</span>
                    ))}
                  </div>
                )}
              </button>
            </div>
          );
        })}
        </div>
        </div>
      </div>
    </div>
  );
}

