import { Language } from './i18n';
import { PlayerCosmetics, DEFAULT_COSMETICS } from './cosmetics';
import { storageBatcher } from './storageBatcher';
import { GAME_CONFIG } from './gameConfig';

export type GameScreen = 'menu' | 'settings' | 'nameInput' | 'stageSelect' | 'map' | 'quiz' | 'levelComplete' | 'leaderboard' | 'gameComplete' | 'shop' | 'gameOver' | 'sideQuestUnlock' | 'sideQuest' | 'cosmetics';

export interface GameState {
  screen: GameScreen;
  playerName: string;
  currentStage: number;
  currentLevel: number;
  completedLevels: number[];
  completedStages: number[];
  completedSideQuests: number[];
  levelScores: Record<number, number>;
  levelStars: Record<number, number>;
  totalScore: number; // For leaderboard display (total XP earned)
  xp: number; // Spendable currency
  health: number;
  maxHealth: number;
  healthPotions: number;
  hints: number;
  language: Language;
  musicOn: boolean;
  cosmetics: PlayerCosmetics;
}

const STORAGE_KEY = 'sofinlearn_progress';
const SETTINGS_KEY = 'sofinlearn_settings';
const USERS_KEY = 'sofinlearn_users';

const DEFAULT_STATE: Partial<GameState> = {
  health: GAME_CONFIG.INITIAL_HEALTH,
  maxHealth: GAME_CONFIG.MAX_HEALTH,
  healthPotions: 0,
  hints: 0,
  xp: 0,
  totalScore: 0,
  currentStage: 1,
  completedStages: [],
  completedSideQuests: [],
  cosmetics: DEFAULT_COSMETICS,
};

export function loadProgress(): Partial<GameState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to load progress:', err);
  }
  return DEFAULT_STATE;
}

export function loadUserProgress(username: string): Partial<GameState> {
  try {
    const users = localStorage.getItem(USERS_KEY);
    if (users) {
      const allUsers = JSON.parse(users);
      const userData = allUsers[username];
      if (userData) {
        return {
          ...userData,
          cosmetics: userData.cosmetics || DEFAULT_COSMETICS
        };
      }
    }
  } catch (err) {
    console.error('Failed to load user progress:', err);
  }
  return DEFAULT_STATE;
}

export function saveProgress(state: Partial<GameState>, immediate = false) {
  try {
    const existing = loadProgress();
    const data = JSON.stringify({ ...existing, ...state });
    storageBatcher.set(STORAGE_KEY, data, immediate);
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}

export function saveUserProgress(username: string, state: Partial<GameState>, immediate = false) {
  try {
    const users = localStorage.getItem(USERS_KEY);
    const allUsers = users ? JSON.parse(users) : {};
    
    allUsers[username] = {
      currentStage: state.currentStage,
      completedLevels: state.completedLevels,
      completedStages: state.completedStages,
      completedSideQuests: state.completedSideQuests,
      levelScores: state.levelScores,
      levelStars: state.levelStars,
      totalScore: state.totalScore,
      xp: state.xp,
      health: state.health,
      maxHealth: state.maxHealth,
      healthPotions: state.healthPotions,
      hints: state.hints,
      cosmetics: state.cosmetics,
    };
    
    const data = JSON.stringify(allUsers);
    storageBatcher.set(USERS_KEY, data, immediate);
  } catch (err) {
    console.error('Failed to save user progress:', err);
  }
}

export function loadSettings(): { language: Language; musicOn: boolean } {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
  return { language: 'en', musicOn: true };
}

export function saveSettings(language: Language, musicOn: boolean) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ language, musicOn }));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset progress:', err);
  }
}

export const STAGES = [
  { 
    id: 1, 
    name: 'JavaScript Basics',
    nameId: 'JavaScript Dasar',
    levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  { 
    id: 2, 
    name: 'JavaScript Advanced',
    nameId: 'JavaScript Lanjutan',
    levels: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  },
  { 
    id: 3, 
    name: 'JavaScript Expert',
    nameId: 'JavaScript Expert',
    levels: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
  },
];

export const LEVELS = [
  // Stage 1: JavaScript Basics
  { id: 0, stage: 1, topic: 'variables' as const },
  { id: 1, stage: 1, topic: 'loops' as const },
  { id: 2, stage: 1, topic: 'functions' as const },
  { id: 3, stage: 1, topic: 'arrays' as const },
  { id: 4, stage: 1, topic: 'debugging' as const },
  { id: 5, stage: 1, topic: 'objects' as const },
  { id: 6, stage: 1, topic: 'async' as const },
  { id: 7, stage: 1, topic: 'dom' as const },
  { id: 8, stage: 1, topic: 'es6' as const },
  { id: 9, stage: 1, topic: 'algorithms' as const },
  // Stage 2: JavaScript Advanced
  { id: 10, stage: 2, topic: 'closures' as const },
  { id: 11, stage: 2, topic: 'prototypes' as const },
  { id: 12, stage: 2, topic: 'promises' as const },
  { id: 13, stage: 2, topic: 'generators' as const },
  { id: 14, stage: 2, topic: 'modules' as const },
  { id: 15, stage: 2, topic: 'regex' as const },
  { id: 16, stage: 2, topic: 'performance' as const },
  { id: 17, stage: 2, topic: 'security' as const },
  { id: 18, stage: 2, topic: 'patterns' as const },
  { id: 19, stage: 2, topic: 'testing' as const },
  // Stage 3: JavaScript Expert
  { id: 20, stage: 3, topic: 'typescript' as const },
  { id: 21, stage: 3, topic: 'webpack' as const },
  { id: 22, stage: 3, topic: 'react' as const },
  { id: 23, stage: 3, topic: 'nodejs' as const },
  { id: 24, stage: 3, topic: 'graphql' as const },
  { id: 25, stage: 3, topic: 'microservices' as const },
  { id: 26, stage: 3, topic: 'docker' as const },
  { id: 27, stage: 3, topic: 'cicd' as const },
  { id: 28, stage: 3, topic: 'cloud' as const },
  { id: 29, stage: 3, topic: 'architecture' as const },
];

