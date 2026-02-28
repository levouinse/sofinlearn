import { useState, useEffect } from 'react';
import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { GameScreen } from '@/lib/gameState';
import { getRankFromBadge, PlayerCosmetics } from '@/lib/cosmetics';

interface Props {
  lang: Language;
  completedStages: number[];
  completedSideQuests: number[];
  xp: number;
  totalScore: number;
  cosmetics: PlayerCosmetics;
  onNavigate: (screen: GameScreen) => void;
  onShowTutorial: () => void;
  onPlaySideQuest: (stage: number) => void;
}

export default function MainMenu({ lang, completedStages, completedSideQuests, xp, totalScore, cosmetics, onNavigate, onShowTutorial, onPlaySideQuest }: Props) {
  const [titleVisible, setTitleVisible] = useState('');
  const fullTitle = t('title', lang);
  const rank = getRankFromBadge(cosmetics.badge);

  useEffect(() => {
    setTitleVisible('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullTitle.length) {
        setTitleVisible(fullTitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [fullTitle]);

  const handleClick = (screen: GameScreen) => {
    playSfx('click');
    onNavigate(screen);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-primary glow-text tracking-wider">
          {titleVisible}
          <span className="animate-pulse">_</span>
        </h1>
      </div>
      <p className="text-muted-foreground font-pixel text-[10px] sm:text-xs mb-12 tracking-wide">
        {t('subtitle', lang)}
      </p>

      {/* Pixel Character */}
      <div className="mb-10 relative group">
        <div className="w-16 h-20 relative pixel-char cursor-pointer hover:scale-110 transition-transform">
          {/* Head */}
          <div className="absolute top-0 left-3 w-10 h-10 bg-primary rounded-sm border border-border animate-bounce-slow" />
          {/* Eyes */}
          <div className="absolute top-3 left-5 w-2 h-2 bg-background rounded-sm animate-blink" />
          <div className="absolute top-3 left-9 w-2 h-2 bg-background rounded-sm animate-blink" />
          {/* Body */}
          <div className="absolute top-10 left-4 w-8 h-7 bg-secondary rounded-sm" />
          {/* Legs */}
          <div className="absolute top-[68px] left-4 w-3 h-4 bg-primary rounded-sm animate-walk" />
          <div className="absolute top-[68px] left-9 w-3 h-4 bg-primary rounded-sm animate-walk-delay" />
        </div>
        
        {/* Speech Bubble */}
        <div className="absolute left-20 top-0 opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <div className="bg-card border border-primary px-3 py-2 rounded relative">
            <p className="font-pixel text-[8px] text-primary">Hi! Ready to code? 👋</p>
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-card border-l border-b 
              border-primary rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Menu Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Rank Display */}
        <div className="border border-primary bg-card p-3 rounded text-center">
          <p className="font-pixel text-[8px] text-muted-foreground mb-1">{lang === 'id' ? 'Rank Kamu' : 'Your Rank'}</p>
          <p className="font-pixel text-sm mb-1" style={{ color: rank.color }}>
            {rank.icon} {lang === 'id' ? rank.rankId : rank.rank}
          </p>
          <p className="font-pixel text-[10px] text-primary">🏆 {totalScore.toLocaleString()}</p>
        </div>

        {/* XP Display */}
        <div className="border border-accent bg-card p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="font-pixel text-[10px] text-muted-foreground">💎 {t('xp', lang)}</span>
            <span className="font-pixel text-sm text-accent">{xp}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }}
            />
          </div>
          <p className="font-pixel text-[8px] text-muted-foreground mt-1 text-center">
            {lang === 'id' ? 'Gunakan XP di Shop!' : 'Use XP in Shop!'}
          </p>
        </div>

        {[
          { label: t('startGame', lang), screen: 'nameInput' as GameScreen },
          { label: t('shop', lang), screen: 'shop' as GameScreen },
          { label: t('leaderboard', lang), screen: 'leaderboard' as GameScreen },
          { label: t('settings', lang), screen: 'settings' as GameScreen },
        ].map(({ label, screen }) => (
          <button
            key={screen}
            onClick={() => handleClick(screen)}
            className="w-full py-3 px-6 border border-primary bg-background text-primary font-pixel text-xs sm:text-sm
              hover:bg-primary hover:text-primary-foreground transition-all duration-200
              glow-border active:scale-95"
          >
            {'> '}{label}
          </button>
        ))}
        
        {/* Side Quest Button - Only show if unlocked */}
        {completedStages.length > 0 && (
          <button
            onClick={() => {
              playSfx('click');
              // Find first incomplete side quest
              const availableStage = completedStages.find(s => !completedSideQuests.includes(s)) || completedStages[0];
              onPlaySideQuest(availableStage);
            }}
            className="w-full py-3 px-6 border border-accent bg-background text-accent font-pixel text-xs sm:text-sm
              hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95 relative"
          >
            {'🎮 '}{lang === 'id' ? 'Side Quest' : 'Side Quest'}
            {completedStages.some(s => !completedSideQuests.includes(s)) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></span>
            )}
          </button>
        )}
        
        {/* Tutorial Button */}
        <button
          onClick={() => {
            playSfx('click');
            onShowTutorial();
          }}
          className="w-full py-2 px-6 border border-accent bg-background text-accent font-pixel text-[10px]
            hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95"
        >
          {'? '}{t('showTutorial', lang)}
        </button>
      </div>

      {/* Version */}
      <p className="absolute bottom-4 text-muted-foreground text-xs font-pixel">v1.0.0</p>
    </div>
  );
}

