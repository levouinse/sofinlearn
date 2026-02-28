import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Language, t } from '@/lib/i18n';
import { GameScreen, GameState, loadProgress, saveProgress, loadUserProgress, saveUserProgress, loadSettings, saveSettings, resetProgress, LEVELS, STAGES } from '@/lib/gameState';
import { startMusic, stopMusic, playSfx } from '@/lib/audioEngine';
import { PlayerCosmetics, DEFAULT_COSMETICS, COSMETIC_ITEMS, BadgeType, FrameType, NameEffectType } from '@/lib/cosmetics';
import { syncToLeaderboard } from '@/lib/leaderboardSync';
import { GAME_CONFIG } from '@/lib/gameConfig';
import MatrixBackground from '@/components/game/MatrixBackground';
import MusicToggle from '@/components/game/MusicToggle';
import MainMenu from '@/components/game/MainMenu';
import Settings from '@/components/game/Settings';
import PlayerNameInput from '@/components/game/PlayerNameInput';
import StageSelect from '@/components/game/StageSelect';
import MapScreen from '@/components/game/MapScreen';
import ErrorBoundary from '@/components/ErrorBoundary';

const QuizGameplay = lazy(() => import('@/components/game/QuizGameplay'));
const LevelComplete = lazy(() => import('@/components/game/LevelComplete'));
const GameComplete = lazy(() => import('@/components/game/GameComplete'));
const Leaderboard = lazy(() => import('@/components/game/Leaderboard'));
const Shop = lazy(() => import('@/components/game/Shop'));
const GameOver = lazy(() => import('@/components/game/GameOver'));
const Tutorial = lazy(() => import('@/components/game/Tutorial'));
const SideQuestUnlock = lazy(() => import('@/components/game/SideQuestUnlock'));
const SideQuest = lazy(() => import('@/components/game/SideQuest'));

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [playerName, setPlayerName] = useState('');
  const [currentStage, setCurrentStage] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [completedSideQuests, setCompletedSideQuests] = useState<number[]>([]);
  const [levelScores, setLevelScores] = useState<Record<number, number>>({});
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [health, setHealth] = useState(GAME_CONFIG.INITIAL_HEALTH);
  const [maxHealth] = useState(GAME_CONFIG.MAX_HEALTH);
  const [healthPotions, setHealthPotions] = useState(0);
  const [hints, setHints] = useState(0);
  const [lastLevelScore, setLastLevelScore] = useState(0);
  const [lastLevelStars, setLastLevelStars] = useState(0);
  const [healthShake, setHealthShake] = useState(false);
  const [showDamageOverlay, setShowDamageOverlay] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [cosmetics, setCosmetics] = useState<PlayerCosmetics>(DEFAULT_COSMETICS);

  const settings = loadSettings();
  const [lang, setLang] = useState<Language>(settings.language);
  const [musicOn, setMusicOn] = useState(settings.musicOn);
  const [musicInitialized, setMusicInitialized] = useState(false);

  useEffect(() => {
    const progress = loadProgress();
    if (progress.playerName) {
      setPlayerName(progress.playerName);
      loadUserData(progress.playerName);
    } else {
      const hasSeenTutorial = localStorage.getItem('sofinlearn_tutorial_seen');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
        localStorage.setItem('sofinlearn_tutorial_seen', 'true');
      }
    }
  }, []);

  const loadUserData = (username: string) => {
    const progress = loadUserProgress(username);
    
    setCurrentStage(progress.currentStage || 1);
    setCompletedLevels(progress.completedLevels || []);
    setCompletedStages(progress.completedStages || []);
    setCompletedSideQuests(progress.completedSideQuests || []);
    setLevelScores(progress.levelScores || {});
    setLevelStars(progress.levelStars || {});
    setTotalScore(progress.totalScore || 0);
    setXp(progress.xp ?? 0);
    setHealth(progress.health ?? GAME_CONFIG.INITIAL_HEALTH);
    setHealthPotions(progress.healthPotions ?? 0);
    setHints(progress.hints ?? 0);
    setCosmetics(progress.cosmetics || DEFAULT_COSMETICS);
  };

  useEffect(() => {
    const initMusic = () => {
      if (!musicInitialized && musicOn) {
        startMusic();
        setMusicInitialized(true);
      }
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, initMusic, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, initMusic);
      });
    };
  }, [musicOn, musicInitialized]);

  useEffect(() => {
    if (musicInitialized) {
      if (musicOn) {
        startMusic();
      } else {
        stopMusic();
      }
    }
  }, [musicOn, musicInitialized]);

  const toggleMusic = useCallback(() => {
    setMusicOn((prev) => {
      const next = !prev;
      saveSettings(lang, next);
      if (!musicInitialized) {
        setMusicInitialized(true);
      }
      return next;
    });
  }, [lang, musicInitialized]);

  const changeLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    saveSettings(newLang, musicOn);
  }, [musicOn]);

  const saveCurrentProgress = useCallback((updates: Partial<GameState>, immediate = false) => {
    if (!playerName) return;
    
    saveUserProgress(playerName, {
      currentStage,
      completedLevels,
      completedStages,
      completedSideQuests,
      levelScores,
      levelStars,
      totalScore,
      xp,
      health,
      maxHealth,
      healthPotions,
      hints,
      cosmetics,
      ...updates
    }, immediate);
  }, [playerName, currentStage, completedLevels, completedStages, completedSideQuests, levelScores, levelStars, totalScore, xp, health, maxHealth, healthPotions, hints, cosmetics]);

  const handleBuyCosmetic = useCallback((itemId: string) => {
    const item = COSMETIC_ITEMS.find(i => i.id === itemId);
    if (!item || cosmetics.ownedItems.includes(itemId)) {
      playSfx('wrong');
      return;
    }

    if (xp < item.cost) {
      playSfx('wrong');
      return;
    }
    
    const newXp = xp - item.cost;
    const newCosmetics = {
      ...cosmetics,
      ownedItems: [...cosmetics.ownedItems, itemId]
    };
    
    setXp(newXp);
    setCosmetics(newCosmetics);
    playSfx('levelup');
    saveCurrentProgress({ xp: newXp, cosmetics: newCosmetics }, true);
  }, [cosmetics, xp, saveCurrentProgress]);

  const handleEquipCosmetic = useCallback(async (itemId: string) => {
    const item = COSMETIC_ITEMS.find(i => i.id === itemId);
    if (!item || !cosmetics.ownedItems.includes(itemId)) return;

    const newCosmetics = { ...cosmetics };
    
    if (item.type === 'badge') {
      const badgeValue = itemId.replace('badge_', '');
      newCosmetics.badge = badgeValue as BadgeType;
    } else if (item.type === 'frame') {
      const frameValue = itemId.replace('frame_', '');
      newCosmetics.frame = frameValue as FrameType;
    } else if (item.type === 'nameEffect') {
      const nameValue = itemId.replace('name_', '');
      newCosmetics.nameEffect = nameValue as NameEffectType;
    }
    
    setCosmetics(newCosmetics);
    playSfx('correct');
    saveCurrentProgress({ cosmetics: newCosmetics }, true);
    
    syncToLeaderboard(playerName, totalScore, newCosmetics);
  }, [cosmetics, playerName, totalScore, saveCurrentProgress]);

  const handleUnequipCosmetic = useCallback(async (type: 'badge' | 'frame' | 'nameEffect') => {
    const newCosmetics = { ...cosmetics };
    
    if (type === 'badge') {
      newCosmetics.badge = 'none';
    } else if (type === 'frame') {
      newCosmetics.frame = 'none';
    } else if (type === 'nameEffect') {
      newCosmetics.nameEffect = 'none';
    }
    
    setCosmetics(newCosmetics);
    playSfx('click');
    saveCurrentProgress({ cosmetics: newCosmetics }, true);
    
    syncToLeaderboard(playerName, totalScore, newCosmetics);
  }, [cosmetics, playerName, totalScore, saveCurrentProgress]);

  const handleNameSubmit = useCallback((name: string) => {
    setPlayerName(name);
    saveProgress({ playerName: name }, true);
    loadUserData(name);
    setScreen('stageSelect');
  }, []);

  const handleLevelComplete = useCallback((score: number, stars: number) => {
    const baseScore = score;
    let earnedXP = baseScore;
    
    // Apply star multiplier to XP only
    if (stars === 3) {
      earnedXP = Math.floor(earnedXP * GAME_CONFIG.STAR_3_MULTIPLIER);
    } else if (stars === 2) {
      earnedXP = Math.floor(earnedXP * GAME_CONFIG.STAR_2_MULTIPLIER);
    }
    
    const isFirstTime = !completedLevels.includes(currentLevel);
    if (isFirstTime) {
      earnedXP += GAME_CONFIG.FIRST_CLEAR_BONUS;
    }
    
    const newCompletedLevels = [...new Set([...completedLevels, currentLevel])];
    const newScores = { ...levelScores, [currentLevel]: Math.max(levelScores[currentLevel] || 0, score) };
    const newStars = { ...levelStars, [currentLevel]: Math.max(levelStars[currentLevel] || 0, stars) };

    const stageLevels = LEVELS.filter(l => l.stage === currentStage).map(l => l.id);
    const stageCompleted = stageLevels.every(id => newCompletedLevels.includes(id));
    
    let stageBonus = 0;
    const newCompletedStages = stageCompleted && !completedStages.includes(currentStage)
      ? [...completedStages, currentStage]
      : completedStages;
    
    if (stageCompleted && !completedStages.includes(currentStage)) {
      stageBonus = GAME_CONFIG.STAGE_COMPLETION_BONUS;
    }

    // Total Score = RAW base score + stage bonus (for leaderboard)
    // XP = Multiplied score + bonuses (for spending)
    const newXp = xp + earnedXP + stageBonus;
    const newTotal = totalScore + baseScore + stageBonus;

    setCompletedLevels(newCompletedLevels);
    setCompletedStages(newCompletedStages);
    setLevelScores(newScores);
    setLevelStars(newStars);
    setTotalScore(newTotal);
    setXp(newXp);
    setLastLevelScore(score);
    setLastLevelStars(stars);

    saveCurrentProgress({
      currentStage,
      completedLevels: newCompletedLevels,
      completedStages: newCompletedStages,
      completedSideQuests,
      levelScores: newScores,
      levelStars: newStars,
      totalScore: newTotal,
      xp: newXp,
    }, true);

    if (newCompletedStages.length === STAGES.length) {
      setScreen('gameComplete');
    } else if (stageCompleted && !completedStages.includes(currentStage) && !completedSideQuests.includes(currentStage)) {
      setScreen('sideQuestUnlock');
    } else {
      setScreen('levelComplete');
    }
  }, [completedLevels, currentLevel, levelScores, levelStars, xp, totalScore, currentStage, completedStages, completedSideQuests, saveCurrentProgress]);

  const handleBuyItem = useCallback((item: 'potion' | 'hint') => {
    const cost = item === 'potion' ? GAME_CONFIG.SHOP_POTION_COST : GAME_CONFIG.SHOP_HINT_COST;
    const maxLimit = item === 'potion' ? GAME_CONFIG.SHOP_MAX_POTIONS : GAME_CONFIG.SHOP_MAX_HINTS;
    const currentAmount = item === 'potion' ? healthPotions : hints;
    
    if (currentAmount >= maxLimit) {
      playSfx('wrong');
      return;
    }
    
    if (xp >= cost) {
      const newXp = xp - cost;
      setXp(newXp);
      if (item === 'potion') {
        setHealthPotions(healthPotions + 1);
      } else {
        setHints(hints + 1);
      }
      playSfx('correct');
      saveCurrentProgress({ 
        xp: newXp, 
        healthPotions: item === 'potion' ? healthPotions + 1 : healthPotions, 
        hints: item === 'hint' ? hints + 1 : hints 
      }, true);
    } else {
      playSfx('wrong');
    }
  }, [xp, healthPotions, hints, saveCurrentProgress]);

  const handleHealthLost = useCallback(() => {
    const newHealth = health - 1;
    setHealth(newHealth);
    setHealthShake(true);
    setShowDamageOverlay(true);
    setTimeout(() => {
      setHealthShake(false);
      setShowDamageOverlay(false);
    }, 500);
    saveCurrentProgress({ health: newHealth });
  }, [health, saveCurrentProgress]);

  const handleHintUsed = useCallback(() => {
    const newHints = hints - 1;
    setHints(newHints);
    saveCurrentProgress({ hints: newHints });
  }, [hints, saveCurrentProgress]);

  const handleGameOver = useCallback((score: number) => {
    setCurrentScore(score);
    setScreen('gameOver');
  }, []);

  const handleRetryLevel = useCallback(() => {
    const newHealth = GAME_CONFIG.INITIAL_HEALTH;
    setHealth(newHealth);
    saveCurrentProgress({ health: newHealth });
    setScreen('quiz');
  }, [saveCurrentProgress]);

  const handlePlayAgain = useCallback(() => {
    setScreen('map');
  }, []);

  const handleSideQuestComplete = useCallback((xpEarned: number) => {
    const newXp = xp + xpEarned;
    const newCompletedSideQuests = completedSideQuests.includes(currentStage) 
      ? completedSideQuests 
      : [...completedSideQuests, currentStage];
    
    setXp(newXp);
    setCompletedSideQuests(newCompletedSideQuests);
    
    const newTotal = totalScore + xpEarned;
    setTotalScore(newTotal);
    
    saveCurrentProgress({
      completedSideQuests: newCompletedSideQuests,
      xp: newXp,
      totalScore: newTotal,
    }, true);
    
    playSfx('levelup');
    setScreen('stageSelect');
  }, [xp, totalScore, completedSideQuests, currentStage, saveCurrentProgress]);

  const handleResetProgress = useCallback(() => {
    resetProgress();
    
    if (playerName) {
      const users = localStorage.getItem('sofinlearn_users');
      if (users) {
        const allUsers = JSON.parse(users);
        delete allUsers[playerName];
        localStorage.setItem('sofinlearn_users', JSON.stringify(allUsers));
      }
    }
    
    setCurrentStage(1);
    setCompletedLevels([]);
    setCompletedStages([]);
    setCompletedSideQuests([]);
    setLevelScores({});
    setLevelStars({});
    setXp(0);
    setHealth(GAME_CONFIG.INITIAL_HEALTH);
    setHealthPotions(0);
    setHints(0);
    setTotalScore(0);
    setScreen('menu');
  }, [playerName]);

  const handleImportProgress = useCallback((data: string) => {
    try {
      const imported = JSON.parse(data);
      
      if (playerName) {
        const users = localStorage.getItem('sofinlearn_users');
        const allUsers = users ? JSON.parse(users) : {};
        allUsers[playerName] = imported;
        localStorage.setItem('sofinlearn_users', JSON.stringify(allUsers));
        
        loadUserData(playerName);
        playSfx('levelup');
      }
    } catch (err) {
      playSfx('wrong');
    }
  }, [playerName]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <MatrixBackground />
      <div className="crt-overlay" />
      {showDamageOverlay && <div className="damage-overlay" />}
      <MusicToggle musicOn={musicOn} onToggle={toggleMusic} />

      {/* Health Bar - Only show during quiz */}
      {screen === 'quiz' && (
        <>
          <div className={`fixed top-4 left-4 z-40 flex gap-1 ${healthShake ? 'health-shake' : ''}`}>
            {Array.from({ length: maxHealth }).map((_, i) => (
              <span 
                key={i} 
                className={`text-2xl transition-all duration-300 ${i < health ? 'scale-100' : 'scale-0 opacity-0'}`}
              >
                ❤️
              </span>
            ))}
          </div>

          {/* Health Potion & Hint Display */}
          <div className="fixed top-16 left-4 z-40 flex flex-col gap-2">
            {healthPotions > 0 && (
              <button
                onClick={() => {
                  if (health >= maxHealth) return;
                  const newHealth = Math.min(health + 1, maxHealth);
                  const newPotions = healthPotions - 1;
                  setHealth(newHealth);
                  setHealthPotions(newPotions);
                  playSfx('levelup');
                  saveCurrentProgress({ health: newHealth, healthPotions: newPotions });
                }}
                disabled={health >= maxHealth}
                className="px-3 py-1 border border-primary text-primary font-pixel text-[10px]
                  hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🧪 {healthPotions}x
              </button>
            )}
            {hints > 0 && (
              <div className="px-3 py-1 border border-accent text-accent font-pixel text-[10px]">
                💡 {hints}x
              </div>
            )}
          </div>
        </>
      )}

      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="font-pixel text-primary animate-pulse">Loading...</div></div>}>
        <ErrorBoundary>
          {screen === 'menu' && (
            <MainMenu 
              lang={lang} 
              completedStages={completedStages}
              completedSideQuests={completedSideQuests}
              xp={xp}
              totalScore={totalScore}
              cosmetics={cosmetics}
              onNavigate={setScreen} 
              onShowTutorial={() => setShowTutorial(true)}
              onPlaySideQuest={(stage) => {
                setCurrentStage(stage);
                setScreen('sideQuest');
              }}
            />
          )}

          {screen === 'shop' && (
            <Shop
              lang={lang}
              xp={xp}
              totalScore={totalScore}
              healthPotions={healthPotions}
              hints={hints}
              cosmetics={cosmetics}
              playerName={playerName}
              onBuyXP={handleBuyItem}
              onBuyCosmetic={handleBuyCosmetic}
              onEquipCosmetic={handleEquipCosmetic}
              onUnequipCosmetic={handleUnequipCosmetic}
              onBack={() => setScreen('menu')}
            />
          )}

          {screen === 'settings' && (
            <Settings
              lang={lang}
              musicOn={musicOn}
              playerName={playerName}
              onToggleMusic={toggleMusic}
              onChangeLanguage={changeLanguage}
              onResetProgress={handleResetProgress}
              onImportProgress={handleImportProgress}
              onBack={() => setScreen('menu')}
            />
          )}

          {screen === 'nameInput' && (
            <PlayerNameInput
              lang={lang}
              initialName={playerName}
              onSubmit={handleNameSubmit}
              onBack={() => setScreen('menu')}
            />
          )}

          {screen === 'stageSelect' && (
            <StageSelect
              lang={lang}
              currentStage={currentStage}
              completedStages={completedStages}
              onSelectStage={(stageId) => {
                setCurrentStage(stageId);
                setScreen('map');
              }}
              onBack={() => setScreen('menu')}
            />
          )}

          {screen === 'map' && (
            <MapScreen
              lang={lang}
              currentStage={currentStage}
              completedLevels={completedLevels}
              levelStars={levelStars}
              onSelectLevel={(id) => { 
                setCurrentLevel(id); 
                setHealth(GAME_CONFIG.INITIAL_HEALTH); 
                saveCurrentProgress({ health: GAME_CONFIG.INITIAL_HEALTH });
                setScreen('quiz'); 
              }}
              onBack={() => setScreen('stageSelect')}
            />
          )}

          {screen === 'quiz' && (
            <QuizGameplay
              lang={lang}
              levelId={currentLevel}
              health={health}
              hints={hints}
              onComplete={handleLevelComplete}
              onHealthLost={handleHealthLost}
              onHintUsed={handleHintUsed}
              onGameOver={handleGameOver}
              onExit={() => setScreen('map')}
            />
          )}

          {screen === 'gameOver' && (
            <GameOver
              lang={lang}
              score={currentScore}
              onRetry={handleRetryLevel}
              onMainMenu={() => setScreen('menu')}
            />
          )}

          {screen === 'levelComplete' && (
            <LevelComplete
              lang={lang}
              levelId={currentLevel}
              score={lastLevelScore}
              stars={lastLevelStars}
              currentStage={currentStage}
              completedStages={completedStages}
              onNext={() => { 
                const nextLevelId = currentLevel + 1;
                const nextLevel = LEVELS.find(l => l.id === nextLevelId);
                if (nextLevel && nextLevel.stage === currentStage) {
                  setCurrentLevel(nextLevelId); 
                  setHealth(GAME_CONFIG.INITIAL_HEALTH);
                  saveCurrentProgress({ health: GAME_CONFIG.INITIAL_HEALTH });
                  setScreen('quiz');
                } else {
                  setScreen('map');
                }
              }}
              onBackToMap={() => setScreen('map')}
              onNextStage={() => {
                setCurrentStage(currentStage + 1);
                setScreen('stageSelect');
              }}
            />
          )}

          {screen === 'gameComplete' && (
            <GameComplete
              lang={lang}
              playerName={playerName}
              totalScore={totalScore}
              cosmetics={cosmetics}
              onPlayAgain={handlePlayAgain}
              onLeaderboard={() => setScreen('leaderboard')}
            />
          )}

          {screen === 'leaderboard' && (
            <Leaderboard lang={lang} onBack={() => setScreen('menu')} />
          )}

          {screen === 'sideQuestUnlock' && (
            <SideQuestUnlock
              lang={lang}
              stage={currentStage}
              onPlay={() => setScreen('sideQuest')}
              onSkip={() => setScreen('stageSelect')}
            />
          )}

          {screen === 'sideQuest' && (
            <SideQuest
              lang={lang}
              stage={currentStage}
              onComplete={handleSideQuestComplete}
              onSkip={() => setScreen('stageSelect')}
            />
          )}

          {showTutorial && (
            <Tutorial 
              initialLang={lang} 
              onClose={(selectedLang) => {
                setLang(selectedLang);
                saveSettings(selectedLang, musicOn);
                setShowTutorial(false);
              }} 
            />
          )}
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default Index;

