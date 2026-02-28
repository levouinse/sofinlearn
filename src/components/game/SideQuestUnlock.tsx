import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';

interface Props {
  lang: Language;
  stage: number;
  onPlay: () => void;
  onSkip: () => void;
}

export default function SideQuestUnlock({ lang, stage, onPlay, onSkip }: Props) {
  const questTitles = [
    { en: 'Escape from Unemployed!', id: 'Kabur dari Unemployed!' },
    { en: 'Debug the Bug Swarm!', id: 'Debug Serangan Bug!' },
    { en: 'Build the Rocket Ship!', id: 'Bangun Roket!' },
  ];

  const questDescriptions = [
    { 
      en: 'Type code correctly to escape from the Unemployed Monster!', 
      id: 'Ketik kode dengan benar untuk kabur dari Monster Unemployed!' 
    },
    { 
      en: 'Find and fix bugs before they eat your code!', 
      id: 'Temukan dan perbaiki bug sebelum memakan kode kamu!' 
    },
    { 
      en: 'Assemble code blocks to build your rocket to Senior Dev Planet!', 
      id: 'Susun code blocks untuk bangun roket ke Planet Senior Dev!' 
    },
  ];

  const title = questTitles[stage - 1];
  const description = questDescriptions[stage - 1];

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
      <div className="border border-accent bg-card p-8 rounded max-w-md w-full text-center animate-pulse-slow">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="font-pixel text-xl text-accent glow-text mb-2">
          {lang === 'id' ? 'SIDE QUEST TERBUKA!' : 'SIDE QUEST UNLOCKED!'}
        </h2>
        <h3 className="font-pixel text-sm text-primary mb-4">
          {lang === 'id' ? title.id : title.en}
        </h3>
        <p className="font-pixel text-[10px] text-muted-foreground mb-6 leading-relaxed">
          {lang === 'id' ? description.id : description.en}
        </p>

        <div className="bg-background border border-accent p-4 rounded mb-6">
          <p className="font-pixel text-[10px] text-accent mb-2">
            {lang === 'id' ? 'Hadiah:' : 'Rewards:'}
          </p>
          <p className="font-pixel text-xs text-primary">+500 XP 🏆</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              playSfx('click');
              onPlay();
            }}
            className="w-full py-3 border border-accent bg-accent text-accent-foreground font-pixel text-xs
              hover:bg-accent/80 transition-all glow-border"
          >
            {lang === 'id' ? '🎮 Main Sekarang!' : '🎮 Play Now!'}
          </button>
          <button
            onClick={() => {
              playSfx('click');
              onSkip();
            }}
            className="w-full py-2 border border-muted text-muted-foreground font-pixel text-[10px]
              hover:border-primary hover:text-primary transition-all"
          >
            {lang === 'id' ? 'Lewati (Main Nanti)' : 'Skip (Play Later)'}
          </button>
        </div>
      </div>
    </div>
  );
}
