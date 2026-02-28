import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { STAGES } from '@/lib/gameState';

interface Props {
  lang: Language;
  currentStage: number;
  completedStages: number[];
  onSelectStage: (stageId: number) => void;
  onBack: () => void;
}

export default function StageSelect({ lang, currentStage, completedStages, onSelectStage, onBack }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-8">
      {/* Back Button - Fixed Top Left */}
      <button
        onClick={() => { playSfx('click'); onBack(); }}
        className="fixed top-4 left-4 z-40 px-4 py-2 border border-primary text-primary font-pixel text-xs
          hover:bg-primary hover:text-primary-foreground transition-all glow-border"
      >
        {'< '}{t('back', lang)}
      </button>

      <h2 className="font-pixel text-2xl text-primary glow-text mb-8">
        📚 Select Stage
      </h2>

      <div className="w-full max-w-md space-y-4 mb-8">
        {STAGES.map((stage) => {
          const isCompleted = completedStages.includes(stage.id);
          const isLocked = stage.id > 1 && !completedStages.includes(stage.id - 1);
          const isCurrent = stage.id === currentStage;

          return (
            <button
              key={stage.id}
              onClick={() => {
                if (!isLocked) {
                  playSfx('click');
                  onSelectStage(stage.id);
                }
              }}
              disabled={isLocked}
              className={`w-full p-4 border rounded transition-all ${
                isLocked
                  ? 'border-muted-foreground bg-muted/20 opacity-50 cursor-not-allowed'
                  : isCurrent
                  ? 'border-primary bg-primary/10 glow-border'
                  : isCompleted
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-card hover:border-primary'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-pixel text-xs text-primary mb-1">
                    Stage {stage.id}
                  </p>
                  <p className="font-pixel text-[10px] text-foreground">
                    {lang === 'id' ? stage.nameId : stage.name}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">
                    10 Levels
                  </p>
                </div>
                <div className="text-2xl">
                  {isLocked ? '🔒' : isCompleted ? '✅' : isCurrent ? '▶️' : '📖'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
