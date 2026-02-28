export type BadgeType = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary';
export type FrameType = 'none' | 'neon' | 'fire' | 'ice' | 'rainbow' | 'galaxy';
export type NameEffectType = 'none' | 'glow' | 'wave' | 'glitch' | 'rainbow' | 'sparkle';

export interface CosmeticItem {
  id: string;
  type: 'badge' | 'frame' | 'nameEffect';
  name: string;
  nameId: string;
  cost: number;
  costType: 'score';
  preview: string;
}

export const COSMETIC_ITEMS: CosmeticItem[] = [
  // Badges (SCORE-based purchase)
  { id: 'badge_bronze', type: 'badge', name: 'Bronze Badge', nameId: 'Lencana Perunggu', cost: 500, costType: 'score', preview: '[B]' },
  { id: 'badge_silver', type: 'badge', name: 'Silver Badge', nameId: 'Lencana Perak', cost: 1500, costType: 'score', preview: '[S]' },
  { id: 'badge_gold', type: 'badge', name: 'Gold Badge', nameId: 'Lencana Emas', cost: 3000, costType: 'score', preview: '[G]' },
  { id: 'badge_diamond', type: 'badge', name: 'Diamond Badge', nameId: 'Lencana Berlian', cost: 5000, costType: 'score', preview: '[D]' },
  { id: 'badge_legendary', type: 'badge', name: 'Legendary Badge', nameId: 'Lencana Legendaris', cost: 10000, costType: 'score', preview: '[L]' },
  
  // Frames (SCORE-based purchase) - GANTI EMOJI DENGAN SYMBOL
  { id: 'frame_neon', type: 'frame', name: 'Neon Frame', nameId: 'Bingkai Neon', cost: 1000, costType: 'score', preview: '⚡' },
  { id: 'frame_fire', type: 'frame', name: 'Fire Frame', nameId: 'Bingkai Api', cost: 2000, costType: 'score', preview: '~' },
  { id: 'frame_ice', type: 'frame', name: 'Ice Frame', nameId: 'Bingkai Es', cost: 2500, costType: 'score', preview: '*' },
  { id: 'frame_rainbow', type: 'frame', name: 'Rainbow Frame', nameId: 'Bingkai Pelangi', cost: 4000, costType: 'score', preview: '≈' },
  { id: 'frame_galaxy', type: 'frame', name: 'Galaxy Frame', nameId: 'Bingkai Galaksi', cost: 7500, costType: 'score', preview: '◆' },
  
  // Name Effects (SCORE-based purchase) - GANTI EMOJI DENGAN SYMBOL
  { id: 'name_glow', type: 'nameEffect', name: 'Glow Effect', nameId: 'Efek Cahaya', cost: 750, costType: 'score', preview: '✨' },
  { id: 'name_wave', type: 'nameEffect', name: 'Wave Effect', nameId: 'Efek Gelombang', cost: 1250, costType: 'score', preview: '~' },
  { id: 'name_glitch', type: 'nameEffect', name: 'Glitch Effect', nameId: 'Efek Glitch', cost: 1750, costType: 'score', preview: '#' },
  { id: 'name_rainbow', type: 'nameEffect', name: 'Rainbow Effect', nameId: 'Efek Pelangi', cost: 3500, costType: 'score', preview: '≈' },
  { id: 'name_sparkle', type: 'nameEffect', name: 'Sparkle Effect', nameId: 'Efek Berkilau', cost: 6000, costType: 'score', preview: '*' },
];

export interface PlayerCosmetics {
  badge: BadgeType;
  frame: FrameType;
  nameEffect: NameEffectType;
  ownedItems: string[];
}

export const DEFAULT_COSMETICS: PlayerCosmetics = {
  badge: 'none',
  frame: 'none',
  nameEffect: 'none',
  ownedItems: [],
};

export function getRankFromScore(score: number): { rank: string; rankId: string; icon: string; color: string } {
  if (score >= 20000) return { rank: 'Legendary Master', rankId: 'Master Legendaris', icon: '[L]', color: '#FFD700' };
  if (score >= 10000) return { rank: 'Diamond Architect', rankId: 'Arsitek Berlian', icon: '[D]', color: '#B9F2FF' };
  if (score >= 6000) return { rank: 'Gold Engineer', rankId: 'Insinyur Emas', icon: '[G]', color: '#FFD700' };
  if (score >= 3000) return { rank: 'Silver Developer', rankId: 'Developer Perak', icon: '[S]', color: '#C0C0C0' };
  if (score >= 1000) return { rank: 'Bronze Coder', rankId: 'Coder Perunggu', icon: '[B]', color: '#CD7F32' };
  return { rank: 'Beginner', rankId: 'Pemula', icon: '[?]', color: '#10b981' };
}

export function getRankFromBadge(badge: BadgeType): { rank: string; rankId: string; icon: string; color: string } {
  if (badge === 'legendary') return { rank: 'Legendary Master', rankId: 'Master Legendaris', icon: '[L]', color: '#FFD700' };
  if (badge === 'diamond') return { rank: 'Diamond Architect', rankId: 'Arsitek Berlian', icon: '[D]', color: '#B9F2FF' };
  if (badge === 'gold') return { rank: 'Gold Engineer', rankId: 'Insinyur Emas', icon: '[G]', color: '#FFD700' };
  if (badge === 'silver') return { rank: 'Silver Developer', rankId: 'Developer Perak', icon: '[S]', color: '#C0C0C0' };
  if (badge === 'bronze') return { rank: 'Bronze Coder', rankId: 'Coder Perunggu', icon: '[B]', color: '#CD7F32' };
  return { rank: 'Beginner', rankId: 'Pemula', icon: '[?]', color: '#10b981' };
}
