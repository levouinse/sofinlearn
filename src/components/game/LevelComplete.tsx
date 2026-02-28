import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { LEVELS, STAGES } from '@/lib/gameState';

interface Props {
  lang: Language;
  levelId: number;
  score: number;
  stars: number;
  currentStage: number;
  completedStages: number[];
  onNext: () => void;
  onBackToMap: () => void;
  onNextStage: () => void;
}

export default function LevelComplete({ lang, levelId, score, stars, currentStage, completedStages, onNext, onBackToMap, onNextStage }: Props) {
  // Calculate XP with bonuses
  let earnedXP = score;
  if (stars === 3) earnedXP = Math.floor(earnedXP * 1.5);
  else if (stars === 2) earnedXP = Math.floor(earnedXP * 1.2);
  
  // Check if this is last level of current stage
  const stageLevels = LEVELS.filter(l => l.stage === currentStage);
  const isLastLevelInStage = levelId === stageLevels[stageLevels.length - 1].id;
  const stageJustCompleted = isLastLevelInStage && !completedStages.includes(currentStage);
  const hasNextStage = currentStage < STAGES.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      <div className="border border-primary bg-card p-8 rounded glow-border w-full max-w-sm text-center">
        <h2 className="font-pixel text-xl text-primary glow-text mb-2">
          {stageJustCompleted ? '🎊 ' + t('stageComplete', lang) : t('levelComplete', lang)}
        </h2>
        
        {/* Stage & Level Info */}
        <p className="font-pixel text-[10px] text-muted-foreground mb-6">
          Stage {currentStage} - Level {levelId + 1}
        </p>

        {/* Stars */}
        <div className="text-3xl mb-6 space-x-2">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={i < stars ? 'star-animate inline-block' : 'opacity-30 inline-block'}>
              ⭐
            </span>
          ))}
        </div>

        <div className="space-y-3 mb-8">
          {/* Score */}
          <div className="flex justify-between font-pixel text-[10px]">
            <span className="text-muted-foreground">{t('score', lang)}</span>
            <span className="text-primary">{score}</span>
          </div>
          
          {/* XP Earned with breakdown */}
          <div className="border-t border-border pt-3">
            <div className="flex justify-between font-pixel text-xs mb-2">
              <span className="text-accent">💎 {t('xpEarned', lang)}</span>
              <span className="text-accent font-bold">+{earnedXP}</span>
            </div>
            
            {/* Bonus breakdown */}
            {stars === 3 && (
              <p className="font-pixel text-[8px] text-primary">
                ✨ Perfect! +50% bonus
              </p>
            )}
            {stars === 2 && (
              <p className="font-pixel text-[8px] text-primary">
                ⭐ Great! +20% bonus
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {stageJustCompleted && hasNextStage ? (
            <button
              onClick={() => { playSfx('levelup'); onNextStage(); }}
              className="w-full py-3 border border-primary text-primary font-pixel text-xs
                hover:bg-primary hover:text-primary-foreground transition-all glow-border active:scale-95"
            >
              {t('nextStage', lang)} {'>'}
            </button>
          ) : !isLastLevelInStage && (
            <button
              onClick={() => { playSfx('click'); onNext(); }}
              className="w-full py-3 border border-primary text-primary font-pixel text-xs
                hover:bg-primary hover:text-primary-foreground transition-all glow-border active:scale-95"
            >
              {t('nextLevel', lang)} {'>'}
            </button>
          )}
          <button
            onClick={() => { playSfx('click'); onBackToMap(); }}
            className="w-full py-3 border border-border text-muted-foreground font-pixel text-xs
              hover:border-primary hover:text-primary transition-all active:scale-95"
          >
            {t('backToMap', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
