import { useState, useEffect, useRef } from 'react';
import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { GAME_CONFIG } from '@/lib/gameConfig';

interface Props {
  lang: Language;
  stage: number;
  onComplete: (xpEarned: number) => void;
  onSkip: () => void;
}

const STAGE_1_CHALLENGES = [
  { code: 'const x = 10;', time: 15 },
  { code: 'console.log("Hello");', time: 15 },
  { code: 'let sum = a + b;', time: 15 },
  { code: 'return true;', time: 12 },
  { code: 'if (x > 0) {}', time: 15 },
];

const STAGE_2_CHALLENGES = [
  { code: 'arr.map(x => x * 2)', time: 18 },
  { code: 'async function getData()', time: 18 },
  { code: 'const {name} = obj;', time: 16 },
  { code: 'Promise.all([p1, p2])', time: 18 },
  { code: '[...arr1, ...arr2]', time: 16 },
];

const STAGE_3_CHALLENGES = [
  { code: 'interface User {}', time: 20 },
  { code: 'type Props = {}', time: 18 },
  { code: 'const App: FC = () => {}', time: 22 },
  { code: 'useEffect(() => {}, [])', time: 20 },
  { code: 'docker build -t app .', time: 20 },
];

const ALL_CHALLENGES = [STAGE_1_CHALLENGES, STAGE_2_CHALLENGES, STAGE_3_CHALLENGES];

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SideQuest({ lang, stage, onComplete, onSkip }: Props) {
  const baseChallenges = ALL_CHALLENGES[stage - 1] || STAGE_1_CHALLENGES;
  
  // Shuffle challenges on mount untuk random order
  const [challenges] = useState(() => shuffleArray(baseChallenges));
  
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [input, setInput] = useState('');
  const [lives, setLives] = useState(GAME_CONFIG.SIDE_QUEST_LIVES);
  const [timeLeft, setTimeLeft] = useState(challenges[0].time);
  const [distance, setDistance] = useState(GAME_CONFIG.SIDE_QUEST_INITIAL_DISTANCE);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [lostLife, setLostLife] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const challenge = challenges[currentChallenge];

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver || won || isProcessing) return;
    
    if (timeLeft <= 0) {
      setIsProcessing(true);
      handleWrong();
      const timeoutId = setTimeout(() => setIsProcessing(false), 100);
      return () => clearTimeout(timeoutId);
    }

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) return 0;
        return t - 1;
      });
      setDistance(d => {
        const newDist = d - GAME_CONFIG.SIDE_QUEST_DISTANCE_DECREMENT;
        if (newDist <= GAME_CONFIG.SIDE_QUEST_DANGER_THRESHOLD) return GAME_CONFIG.SIDE_QUEST_DANGER_THRESHOLD;
        return newDist;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, won, isProcessing]);

  // Check if caught
  useEffect(() => {
    if (distance <= GAME_CONFIG.SIDE_QUEST_DANGER_THRESHOLD && !gameOver && !won) {
      setGameOver(true);
      playSfx('wrong');
    }
  }, [distance, gameOver, won]);

  const handleWrong = () => {
    const newLives = lives - 1;
    const newDistance = Math.max(GAME_CONFIG.SIDE_QUEST_DANGER_THRESHOLD, distance - GAME_CONFIG.SIDE_QUEST_DISTANCE_LOSS);
    
    setLives(newLives);
    setDistance(newDistance);
    setLostLife(true);
    playSfx('wrong');
    
    const timeoutId = setTimeout(() => setLostLife(false), 500);
    timeoutsRef.current.push(timeoutId);
    
    if (newLives <= 0) {
      setGameOver(true);
    } else {
      setInput('');
      setTimeLeft(challenge.time);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() === challenge.code) {
      playSfx('correct');
      setCorrectAnswer(true);
      const newDistance = Math.min(GAME_CONFIG.SIDE_QUEST_INITIAL_DISTANCE, distance + GAME_CONFIG.SIDE_QUEST_DISTANCE_GAIN);
      setDistance(newDistance);
      
      const timeoutId1 = setTimeout(() => setCorrectAnswer(false), 500);
      timeoutsRef.current.push(timeoutId1);
      
      if (currentChallenge + 1 >= challenges.length) {
        setWon(true);
        playSfx('levelup');
        const timeoutId2 = setTimeout(() => onComplete(GAME_CONFIG.SIDE_QUEST_XP_REWARD), 1500);
        timeoutsRef.current.push(timeoutId2);
      } else {
        const nextChallenge = currentChallenge + 1;
        setCurrentChallenge(nextChallenge);
        setTimeLeft(challenges[nextChallenge].time);
        setInput('');
      }
    } else {
      handleWrong();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChallenge]);

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
        <div className="border border-destructive bg-card p-8 rounded max-w-md w-full text-center">
          <div className="text-6xl mb-4">👹</div>
          <h2 className="font-pixel text-xl text-destructive mb-4">CAUGHT!</h2>
          <p className="font-pixel text-xs text-muted-foreground mb-6">
            {lang === 'id' ? 'Kamu tertangkap Unemployed Monster!' : 'You got caught by Unemployed Monster!'}
          </p>
          <button
            onClick={onSkip}
            className="w-full py-3 border border-primary text-primary font-pixel text-xs
              hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {lang === 'id' ? 'Kembali' : 'Back'}
          </button>
        </div>
      </div>
    );
  }

  if (won) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4">
        <div className="border border-primary bg-card p-8 rounded max-w-md w-full text-center glow-border">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-pixel text-xl text-primary glow-text mb-4">ESCAPED!</h2>
          <p className="font-pixel text-xs text-muted-foreground mb-2">
            {lang === 'id' ? 'Kamu berhasil kabur!' : 'You escaped successfully!'}
          </p>
          <p className="font-pixel text-sm text-accent mb-6">+{GAME_CONFIG.SIDE_QUEST_XP_REWARD} XP</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="border border-primary bg-card p-4 sm:p-6 rounded max-w-2xl w-full glow-border max-h-[90vh] overflow-y-auto">
        <h2 className="font-pixel text-sm sm:text-lg text-primary glow-text mb-4 text-center">
          🏃 {lang === 'id' ? 'KABUR DARI UNEMPLOYED!' : 'ESCAPE FROM UNEMPLOYED!'}
        </h2>

        {/* Chase Scene */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-b from-sky-900/20 to-green-900/20 border border-border rounded mb-4 overflow-hidden">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-800/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600/50"></div>
          
          {/* Background obstacles - trees/rocks */}
          <div className="absolute bottom-8 left-0 right-0 flex gap-16 opacity-40">
            <div className="w-4 h-12 bg-green-700 rounded-t-full animate-scroll-obstacles"></div>
            <div className="w-6 h-16 bg-green-700 rounded-t-full animate-scroll-obstacles" style={{ animationDelay: '1s' }}></div>
            <div className="w-5 h-10 bg-gray-600 rounded animate-scroll-obstacles" style={{ animationDelay: '2s' }}></div>
            <div className="w-4 h-14 bg-green-700 rounded-t-full animate-scroll-obstacles" style={{ animationDelay: '3s' }}></div>
          </div>
          
          {/* Monster - CSS Entity (Starts from left, chasing) */}
          <div 
            className="absolute bottom-8 z-20 transition-all duration-500"
            style={{ 
              left: `${Math.max(5, Math.min(75, 100 - distance))}%`
            }}
          >
            <div className="relative animate-monster-walk">
              {/* Monster body */}
              <div className="relative w-12 h-16 sm:w-14 sm:h-20">
                {/* Head */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-red-600 rounded-full border-2 border-red-800">
                  {/* Eyes */}
                  <div className="absolute top-2 left-2 w-2 h-3 bg-yellow-400 rounded-full animate-blink"></div>
                  <div className="absolute top-2 right-2 w-2 h-3 bg-yellow-400 rounded-full animate-blink"></div>
                  {/* Mouth */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-black rounded-full"></div>
                  {/* Horns */}
                  <div className="absolute -top-2 left-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-800"></div>
                  <div className="absolute -top-2 right-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-red-800"></div>
                </div>
                {/* Body */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-6 bg-red-700 rounded"></div>
                {/* Arms */}
                <div className="absolute top-9 left-0 w-3 h-1 bg-red-700 rounded animate-arm-swing"></div>
                <div className="absolute top-9 right-0 w-3 h-1 bg-red-700 rounded animate-arm-swing-reverse"></div>
                {/* Legs */}
                <div className="absolute bottom-0 left-2 w-2 h-4 bg-red-800 rounded animate-leg-run"></div>
                <div className="absolute bottom-0 right-2 w-2 h-4 bg-red-800 rounded animate-leg-run-reverse"></div>
              </div>
              {/* Anger symbol */}
              <div className="absolute -top-2 -right-4 text-red-500 font-bold text-xl animate-pulse">#</div>
            </div>
          </div>
          
          {/* Player - CSS Entity (Starts from right, running away) */}
          <div 
            className="absolute bottom-8 z-30 transition-all duration-300"
            style={{ left: `${Math.min(80, Math.max(20, distance * 0.65 + 20))}%` }}
          >
            <div className="relative">
              {/* Player body */}
              <div className="relative w-10 h-16 sm:w-12 sm:h-20 animate-player-run">
                {/* Head */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-2 border-green-600">
                  {/* Eyes */}
                  <div className="absolute top-2 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                  {/* Smile */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 border-b-2 border-black rounded-full"></div>
                </div>
                {/* Body */}
                <div className="absolute top-7 left-1/2 -translate-x-1/2 w-6 h-5 bg-green-600 rounded"></div>
                {/* Arms */}
                <div className="absolute top-8 left-0 w-2 h-1 bg-green-600 rounded animate-arm-swing"></div>
                <div className="absolute top-8 right-0 w-2 h-1 bg-green-600 rounded animate-arm-swing-reverse"></div>
                {/* Legs */}
                <div className="absolute bottom-0 left-1.5 w-2 h-5 bg-green-700 rounded animate-leg-run"></div>
                <div className="absolute bottom-0 right-1.5 w-2 h-5 bg-green-700 rounded animate-leg-run-reverse"></div>
              </div>
              {/* Speed lines */}
              {distance > 60 && (
                <div className="absolute left-0 top-4 -translate-x-full flex gap-1 animate-speed-lines">
                  <div className="w-4 h-0.5 bg-primary/60"></div>
                  <div className="w-3 h-0.5 bg-primary/40"></div>
                  <div className="w-2 h-0.5 bg-primary/20"></div>
                </div>
              )}
            </div>
          </div>

          {/* Distance indicator */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 font-pixel text-xs sm:text-sm text-primary z-40 bg-background/90 px-3 py-1 rounded border border-primary">
            {Math.round(distance)}m
          </div>
          
          {/* Danger zone warning */}
          {distance < 35 && (
            <>
              <div className="absolute inset-0 bg-red-500/20 animate-danger-pulse z-10 pointer-events-none"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-pixel text-xs text-red-500 animate-pulse z-40 bg-background/80 px-2 py-1 rounded">
                ⚠️ DANGER! ⚠️
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
          <div className="flex gap-3">
            {Array.from({ length: GAME_CONFIG.SIDE_QUEST_LIVES }).map((_, i) => (
              <div 
                key={i} 
                className={`relative w-8 h-8 transition-all duration-300 ${
                  i >= lives ? 'opacity-0 scale-0' : lostLife && i === lives ? 'animate-heart-break' : ''
                }`}
              >
                {/* CSS Heart - Simple version */}
                <svg viewBox="0 0 32 32" className="w-full h-full animate-heart-beat">
                  <path
                    d="M16,28 C16,28 4,18 4,11 C4,7 7,4 10,4 C12,4 14,5 16,7 C18,5 20,4 22,4 C25,4 28,7 28,11 C28,18 16,28 16,28 Z"
                    fill="#ef4444"
                    stroke="#dc2626"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            ))}
          </div>
          <div className="font-pixel text-[10px] sm:text-xs text-primary">
            ⏱️ {timeLeft}s
          </div>
          <div className="font-pixel text-[10px] sm:text-xs text-accent">
            {currentChallenge + 1}/{challenges.length}
          </div>
        </div>

        {/* Challenge */}
        <div className={`bg-background border border-border p-3 sm:p-4 rounded mb-4 transition-all ${correctAnswer ? 'flash-correct' : lostLife ? 'flash-wrong' : ''}`}>
          <p className="font-pixel text-[8px] sm:text-[10px] text-muted-foreground mb-2">
            {lang === 'id' ? 'Ketik kode ini:' : 'Type this code:'}
          </p>
          <code className="font-mono text-xs sm:text-sm text-primary block mb-4 bg-muted p-2 rounded break-all">
            {challenge.code}
          </code>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              ref={inputRef}
              id="side-quest-input"
              name="codeInput"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-background border border-primary text-primary font-mono text-xs sm:text-sm
                px-3 sm:px-4 py-2 outline-none focus:glow-border"
              placeholder="Type here..."
              autoComplete="off"
            />
            
            {/* Submit button for mobile */}
            <button
              type="submit"
              className="w-full sm:hidden py-3 border border-primary bg-primary text-primary-foreground 
                font-pixel text-xs active:scale-95 transition-all"
            >
              ✓ Submit
            </button>
          </form>
        </div>

        {/* Keyboard hint for mobile */}
        <p className="font-pixel text-[8px] text-muted-foreground text-center mb-3 hidden sm:block">
          {lang === 'id' ? 'Tekan Enter untuk submit' : 'Press Enter to submit'}
        </p>

        {/* Skip */}
        <button
          onClick={onSkip}
          className="w-full py-2 border border-muted text-muted-foreground font-pixel text-[10px] sm:text-xs
            hover:border-primary hover:text-primary transition-all"
        >
          {lang === 'id' ? 'Lewati Side Quest' : 'Skip Side Quest'}
        </button>
      </div>
    </div>
  );
}
