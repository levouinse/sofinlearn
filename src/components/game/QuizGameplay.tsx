import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { t, Language, TranslationKey } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { getQuestions, QuizQuestion } from '@/lib/quizData';
import { LEVELS } from '@/lib/gameState';
import { GAME_CONFIG } from '@/lib/gameConfig';

interface Props {
  lang: Language;
  levelId: number;
  health: number;
  hints: number;
  onComplete: (score: number, stars: number) => void;
  onHealthLost: () => void;
  onHintUsed: () => void;
  onGameOver: (score: number) => void;
  onExit: () => void;
}

const OptionButton = memo(({ 
  option, 
  idx, 
  isEliminated, 
  isFocused, 
  feedback, 
  selectedIdx, 
  correctIndex, 
  onClick, 
  onMouseEnter 
}: {
  option: string;
  idx: number;
  isEliminated: boolean;
  isFocused: boolean;
  feedback: 'correct' | 'wrong' | null;
  selectedIdx: number | null;
  correctIndex: number;
  onClick: () => void;
  onMouseEnter: () => void;
}) => {
  let borderClass = 'border-border hover:border-primary';
  
  if (isFocused) {
    borderClass = 'border-accent glow-border';
  }
  
  if (feedback && idx === correctIndex) {
    borderClass = 'border-primary bg-secondary';
  } else if (feedback && idx === selectedIdx && idx !== correctIndex) {
    borderClass = 'border-destructive bg-destructive/10';
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={!!feedback || isEliminated}
      className={`w-full text-left py-3 px-4 border bg-card rounded transition-all
        font-mono text-sm ${borderClass} ${!feedback ? 'active:scale-[0.98]' : ''} 
        ${isEliminated ? 'opacity-30 line-through' : ''}`}
    >
      <span className="text-muted-foreground mr-2 font-pixel text-[10px]">
        {String.fromCharCode(65 + idx)}.
      </span>
      {option}
    </button>
  );
});

OptionButton.displayName = 'OptionButton';

export default function QuizGameplay({ lang, levelId, health, hints, onComplete, onHealthLost, onHintUsed, onGameOver, onExit }: Props) {
  const topic = LEVELS[levelId].topic;
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.QUIZ_TIME_PER_QUESTION);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [focusedOption, setFocusedOption] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const isMountedRef = useRef(true);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      const q = getQuestions(topic, lang);
      if (!q || q.length === 0) {
        throw new Error('No questions available for this topic');
      }
      setQuestions(q);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError(lang === 'id' ? 'Gagal memuat soal' : 'Failed to load questions');
    }
  }, [topic, lang]);

  const question: QuizQuestion | undefined = useMemo(() => questions[currentQ], [questions, currentQ]);
  const progress = useMemo(() => ((currentQ) / questions.length) * 100, [currentQ, questions.length]);

  const moveToNext = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setIsTransitioning(true);
    const timeoutId = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      if (currentQ + 1 >= questions.length) {
        const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
        playSfx('levelup');
        onComplete(score, stars);
      } else {
        setCurrentQ((prev) => prev + 1);
        setTimeLeft(GAME_CONFIG.QUIZ_TIME_PER_QUESTION);
        setSelectedIdx(null);
        setFeedback(null);
        setEliminatedOptions([]);
        setFocusedOption(0);
        setIsTransitioning(false);
      }
    }, 800);
    
    return () => clearTimeout(timeoutId);
  }, [currentQ, questions.length, score, mistakes, onComplete]);

  const handleAnswer = useCallback((idx: number) => {
    if (feedback || isTransitioning || !isMountedRef.current || !question || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setSelectedIdx(idx);
    if (idx === question.correctIndex) {
      const timeBonus = Math.floor(timeLeft * GAME_CONFIG.QUIZ_TIME_BONUS_MULTIPLIER);
      setScore((s) => s + GAME_CONFIG.QUIZ_BASE_SCORE + timeBonus);
      setFeedback('correct');
      playSfx('correct');
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          isProcessingRef.current = false;
          moveToNext();
        }
      }, 1000);
      return () => {
        clearTimeout(timeoutId);
        isProcessingRef.current = false;
      };
    } else {
      setMistakes((m) => m + 1);
      setFeedback('wrong');
      playSfx('wrong');
      onHealthLost();
      if (health <= 1) {
        const timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            isProcessingRef.current = false;
            onGameOver(score);
          }
        }, 1000);
        return () => {
          clearTimeout(timeoutId);
          isProcessingRef.current = false;
        };
      } else {
        const timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            isProcessingRef.current = false;
            moveToNext();
          }
        }, 1000);
        return () => {
          clearTimeout(timeoutId);
          isProcessingRef.current = false;
        };
      }
    }
  }, [feedback, isTransitioning, question, timeLeft, health, score, moveToNext, onHealthLost, onGameOver]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (feedback || isTransitioning || isPaused || !isMountedRef.current || !question) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedOption((prev) => (prev + 1) % question.options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedOption((prev) => (prev - 1 + question.options.length) % question.options.length);
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key) - 1;
      if (idx < question.options.length && !eliminatedOptions.includes(idx)) {
        handleAnswer(idx);
      }
    } else if (e.key === 'Enter') {
      if (!eliminatedOptions.includes(focusedOption)) {
        handleAnswer(focusedOption);
      }
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPaused(!isPaused);
      playSfx('click');
    } else if (e.key === 'h' || e.key === 'H') {
      if (hints > 0 && eliminatedOptions.length === 0) {
        const wrongOptions = question.options
          .map((_, idx) => idx)
          .filter(idx => idx !== question.correctIndex);
        const toEliminate = wrongOptions.slice(0, 2);
        setEliminatedOptions(toEliminate);
        onHintUsed();
        playSfx('click');
      }
    }
  }, [feedback, isTransitioning, isPaused, focusedOption, question, eliminatedOptions, handleAnswer, hints, onHintUsed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (feedback || isTransitioning || isPaused || !isMountedRef.current || isProcessingRef.current) return;
    
    if (timeLeft <= 0) {
      isProcessingRef.current = true;
      setMistakes((m) => m + 1);
      setFeedback('wrong');
      playSfx('wrong');
      onHealthLost();
      const currentHealth = health;
      if (currentHealth <= 1) {
        setTimeout(() => {
          if (isMountedRef.current) {
            isProcessingRef.current = false;
            onGameOver(score);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          if (isMountedRef.current) {
            isProcessingRef.current = false;
            moveToNext();
          }
        }, 1000);
      }
      return;
    }
    
    let startTime = Date.now();
    let animationId: number;
    
    const updateTimer = () => {
      if (!isMountedRef.current) {
        cancelAnimationFrame(animationId);
        return;
      }
      
      const elapsed = Date.now() - startTime;
      if (elapsed >= 1000) {
        setTimeLeft((t) => t - 1);
        startTime = Date.now();
      }
      animationId = requestAnimationFrame(updateTimer);
    };
    
    animationId = requestAnimationFrame(updateTimer);
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [timeLeft, feedback, isTransitioning, isPaused, health, score, moveToNext, onHealthLost, onGameOver]);

  if (error || !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
        <div className="border border-destructive bg-card p-8 rounded text-center">
          <p className="font-pixel text-sm text-destructive mb-4">
            {error || (lang === 'id' ? 'Soal tidak ditemukan' : 'Questions not found')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-primary text-primary font-pixel text-xs hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {lang === 'id' ? 'Muat Ulang' : 'Reload'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-8">
      {/* Pause Button */}
      <button
        onClick={() => {
          setIsPaused(!isPaused);
          playSfx('click');
        }}
        className="fixed top-20 right-4 z-40 px-4 py-2 border border-primary text-primary font-pixel text-xs
          hover:bg-primary hover:text-primary-foreground transition-all"
      >
        {isPaused ? '▶️' : '⏸️'}
      </button>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="border border-primary bg-card p-8 rounded glow-border text-center">
            <h3 className="font-pixel text-xl text-primary glow-text mb-6">⏸️ Paused</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsPaused(false);
                  playSfx('click');
                }}
                className="w-full px-6 py-3 border border-primary text-primary font-pixel text-xs
                  hover:bg-primary hover:text-primary-foreground transition-all"
              >
                ▶️ Resume
              </button>
              <button
                onClick={() => {
                  playSfx('click');
                  onExit();
                }}
                className="w-full px-6 py-3 border border-muted-foreground text-muted-foreground font-pixel text-xs
                  hover:border-destructive hover:text-destructive transition-all"
              >
                🚪 Exit to Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-pixel text-[10px] text-primary">
            {t('level', lang)} {levelId + 1} — {t(topic as TranslationKey, lang)}
          </span>
          <span className="font-pixel text-[10px] text-primary">
            {t('score', lang)}: {score}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className={`font-pixel text-lg mb-4 ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
        {t('timeLeft', lang)}: {timeLeft}s
      </div>

      {/* Hint Button */}
      {hints > 0 && eliminatedOptions.length === 0 && !feedback && question && (
        <button
          onClick={() => {
            if (hints <= 0 || eliminatedOptions.length > 0 || !question) return;
            const wrongOptions = question.options
              .map((_, idx) => idx)
              .filter(idx => idx !== question.correctIndex);
            const toEliminate = wrongOptions.slice(0, 2);
            setEliminatedOptions(toEliminate);
            onHintUsed();
            playSfx('click');
          }}
          className="mb-4 px-4 py-2 border border-primary text-primary font-pixel text-xs
            hover:bg-primary hover:text-primary-foreground transition-all"
        >
          💡 {t('useHint', lang)} ({hints})
        </button>
      )}

      {/* Question */}
      <div className={`w-full max-w-md border border-border bg-card p-6 rounded mb-6 ${feedback === 'correct' ? 'flash-correct' : feedback === 'wrong' ? 'flash-wrong' : ''
        }`}>
        <p className="font-pixel text-[10px] text-muted-foreground mb-2">
          {t('question', lang)} {currentQ + 1}/{questions.length}
        </p>
        <p className="text-foreground text-sm font-mono leading-relaxed">{question.question}</p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`font-pixel text-sm mb-4 ${feedback === 'correct' ? 'text-primary glow-text' : 'text-destructive'}`}>
          {feedback === 'correct' ? t('correct', lang) : t('wrong', lang)}
        </div>
      )}

      {/* Options */}
      <div className="w-full max-w-md space-y-3">
        {question.options.map((opt, idx) => (
          <OptionButton
            key={idx}
            option={opt}
            idx={idx}
            isEliminated={eliminatedOptions.includes(idx)}
            isFocused={focusedOption === idx && !feedback}
            feedback={feedback}
            selectedIdx={selectedIdx}
            correctIndex={question.correctIndex}
            onClick={() => handleAnswer(idx)}
            onMouseEnter={() => !feedback && setFocusedOption(idx)}
          />
        ))}
      </div>

      {/* Keyboard hints */}
      <div className="mt-6 text-center">
        <p className="font-pixel text-[8px] text-muted-foreground">
          ⌨️ 1-4: Quick answer | ↑↓: Navigate | Enter: Select | Space: Pause | H: Hint
        </p>
      </div>
    </div>
  );
}

