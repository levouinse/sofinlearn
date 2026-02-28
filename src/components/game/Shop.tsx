import { useMemo, useCallback, memo } from 'react';
import { Language, t } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';
import { COSMETIC_ITEMS, PlayerCosmetics, getRankFromBadge } from '@/lib/cosmetics';
import { GAME_CONFIG } from '@/lib/gameConfig';

interface Props {
  lang: Language;
  xp: number;
  totalScore: number;
  healthPotions: number;
  hints: number;
  cosmetics: PlayerCosmetics;
  playerName: string;
  onBuyXP: (item: 'potion' | 'hint') => void;
  onBuyCosmetic: (itemId: string) => void;
  onEquipCosmetic: (itemId: string) => void;
  onUnequipCosmetic: (type: 'badge' | 'frame' | 'nameEffect') => void;
  onBack: () => void;
}

const XP_ITEMS = [
  { id: 'potion' as const, icon: '❤️', cost: GAME_CONFIG.SHOP_POTION_COST, name: 'Health Potion', nameId: 'Ramuan Nyawa' },
  { id: 'hint' as const, icon: '💡', cost: GAME_CONFIG.SHOP_HINT_COST, name: 'Hint', nameId: 'Petunjuk' },
];

interface CosmeticItemProps {
  item: typeof COSMETIC_ITEMS[0];
  lang: Language;
  xp: number;
  owned: boolean;
  equipped: boolean;
  onBuy: () => void;
  onEquip: () => void;
  onUnequip: () => void;
}

const CosmeticItem = memo(({ item, lang, xp, owned, equipped, onBuy, onEquip, onUnequip }: CosmeticItemProps) => {
  const canBuy = xp >= item.cost && !owned;
  
  return (
    <div className={`border bg-card p-3 rounded text-center hover:scale-105 transition-all ${equipped ? 'border-primary glow-border' : 'border-border'}`}>
      <div className="text-4xl mb-2">{item.preview}</div>
      <p className="font-pixel text-[9px] mb-1 h-8 flex items-center justify-center">{lang === 'id' ? item.nameId : item.name}</p>
      <p className="font-pixel text-[10px] text-accent mb-2">💎 {item.cost}</p>
      {owned ? (
        <button
          onClick={onEquip}
          disabled={equipped}
          className="w-full py-2 border border-primary text-primary font-pixel text-[9px] hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
        >
          {equipped ? '✓ Equipped' : (lang === 'id' ? 'Pakai' : 'Use')}
        </button>
      ) : canBuy ? (
        <button
          onClick={onBuy}
          className="w-full py-2 border border-primary text-primary font-pixel text-[9px] hover:bg-primary hover:text-primary-foreground transition-all"
        >
          {lang === 'id' ? 'Beli' : 'Buy'}
        </button>
      ) : (
        <p className="font-pixel text-[9px] text-muted-foreground py-2">🔒 {lang === 'id' ? 'Terkunci' : 'Locked'}</p>
      )}
      {owned && equipped && (
        <button
          onClick={onUnequip}
          className="w-full py-1 mt-1 border border-muted-foreground text-muted-foreground font-pixel text-[8px] hover:border-destructive hover:text-destructive transition-all"
        >
          {lang === 'id' ? 'Lepas' : 'Unequip'}
        </button>
      )}
    </div>
  );
});

CosmeticItem.displayName = 'CosmeticItem';

export default function Shop({ lang, xp, totalScore, healthPotions, hints, cosmetics, playerName, onBuyXP, onBuyCosmetic, onEquipCosmetic, onUnequipCosmetic, onBack }: Props) {
  const rank = getRankFromBadge(cosmetics.badge);
  
  const badges = useMemo(() => COSMETIC_ITEMS.filter(i => i.type === 'badge'), []);
  const frames = useMemo(() => COSMETIC_ITEMS.filter(i => i.type === 'frame'), []);
  const nameEffects = useMemo(() => COSMETIC_ITEMS.filter(i => i.type === 'nameEffect'), []);

  const ownedItemsSet = useMemo(() => new Set(cosmetics.ownedItems), [cosmetics.ownedItems]);

  const itemStates = useMemo(() => {
    const states = new Map<string, { owned: boolean; equipped: boolean }>();
    COSMETIC_ITEMS.forEach(item => {
      const owned = ownedItemsSet.has(item.id);
      let equipped = false;
      if (item.type === 'badge') {
        equipped = cosmetics.badge === item.id.replace('badge_', '');
      } else if (item.type === 'frame') {
        equipped = cosmetics.frame === item.id.replace('frame_', '');
      } else if (item.type === 'nameEffect') {
        equipped = cosmetics.nameEffect === item.id.replace('name_', '');
      }
      states.set(item.id, { owned, equipped });
    });
    return states;
  }, [ownedItemsSet, cosmetics.badge, cosmetics.frame, cosmetics.nameEffect]);

  const handleBuy = useCallback((itemId: string) => {
    playSfx('click');
    onBuyCosmetic(itemId);
  }, [onBuyCosmetic]);

  const handleEquip = useCallback((itemId: string) => {
    playSfx('click');
    onEquipCosmetic(itemId);
  }, [onEquipCosmetic]);

  const handleUnequipBadge = useCallback(() => {
    playSfx('click');
    onUnequipCosmetic('badge');
  }, [onUnequipCosmetic]);

  const handleUnequipFrame = useCallback(() => {
    playSfx('click');
    onUnequipCosmetic('frame');
  }, [onUnequipCosmetic]);

  const handleUnequipName = useCallback(() => {
    playSfx('click');
    onUnequipCosmetic('nameEffect');
  }, [onUnequipCosmetic]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-8">
      <h2 className="font-pixel text-2xl text-primary glow-text mb-4">🛒 {t('shop', lang)}</h2>
      
      {/* Currency & Rank Card */}
      <div className="border border-primary bg-card p-4 rounded glow-border w-full max-w-md mb-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <p className="font-pixel text-[10px] text-muted-foreground mb-1">💎 XP (Spendable)</p>
            <p className="font-pixel text-xl text-accent">{xp.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="font-pixel text-[10px] text-muted-foreground mb-1">🏆 Total Score</p>
            <p className="font-pixel text-xl text-primary">{totalScore.toLocaleString()}</p>
          </div>
        </div>
        <div className="border-t border-border pt-3 text-center">
          <p className="font-pixel text-sm" style={{ color: rank.color }}>
            {rank.icon} {lang === 'id' ? rank.rankId : rank.rank}
          </p>
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-6 mb-6 max-h-[55vh] overflow-y-auto custom-scrollbar px-2">
        {/* XP Items */}
        <div>
          <h3 className="font-pixel text-sm text-accent mb-3 flex items-center gap-2">
            <span>💎</span>
            <span>{lang === 'id' ? 'Item XP' : 'XP Items'}</span>
            <span className="text-[8px] text-muted-foreground">({lang === 'id' ? 'Beli dengan XP' : 'Buy with XP'})</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {XP_ITEMS.map(item => {
              const currentAmount = item.id === 'potion' ? healthPotions : hints;
              const maxLimit = item.id === 'potion' ? GAME_CONFIG.SHOP_MAX_POTIONS : GAME_CONFIG.SHOP_MAX_HINTS;
              const isMaxed = currentAmount >= maxLimit;
              
              return (
              <div key={item.id} className="border border-accent bg-card p-4 rounded hover:border-primary transition-all">
                <div className="text-4xl mb-2 text-center">{item.icon}</div>
                <p className="font-pixel text-xs text-center mb-2">{lang === 'id' ? item.nameId : item.name}</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="font-pixel text-[10px] text-accent">💎 {item.cost}</p>
                  <p className={`font-pixel text-[10px] ${isMaxed ? 'text-destructive' : 'text-primary'}`}>
                    {currentAmount}/{maxLimit}
                  </p>
                </div>
                <button
                  onClick={() => { playSfx('click'); onBuyXP(item.id); }}
                  disabled={xp < item.cost || isMaxed}
                  className="w-full py-2 border border-accent text-accent font-pixel text-xs hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isMaxed ? (lang === 'id' ? 'Penuh' : 'Max') : (lang === 'id' ? 'Beli' : 'Buy')}
                </button>
              </div>
            )})}

          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-pixel text-sm text-primary mb-3 flex items-center gap-2">
            <span>🏅</span>
            <span>{lang === 'id' ? 'Lencana' : 'Badges'}</span>
            <span className="text-[8px] text-muted-foreground">({lang === 'id' ? 'Beli dengan XP' : 'Buy with XP'})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {badges.map(item => {
              const state = itemStates.get(item.id)!;
              return (
                <CosmeticItem
                  key={item.id}
                  item={item}
                  lang={lang}
                  xp={xp}
                  owned={state.owned}
                  equipped={state.equipped}
                  onBuy={() => handleBuy(item.id)}
                  onEquip={() => handleEquip(item.id)}
                  onUnequip={handleUnequipBadge}
                />
              );
            })}
          </div>
        </div>

        {/* Frames */}
        <div>
          <h3 className="font-pixel text-sm text-primary mb-3 flex items-center gap-2">
            <span>🖼️</span>
            <span>{lang === 'id' ? 'Bingkai' : 'Frames'}</span>
            <span className="text-[8px] text-muted-foreground">({lang === 'id' ? 'Beli dengan XP' : 'Buy with XP'})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {frames.map(item => {
              const state = itemStates.get(item.id)!;
              return (
                <CosmeticItem
                  key={item.id}
                  item={item}
                  lang={lang}
                  xp={xp}
                  owned={state.owned}
                  equipped={state.equipped}
                  onBuy={() => handleBuy(item.id)}
                  onEquip={() => handleEquip(item.id)}
                  onUnequip={handleUnequipFrame}
                />
              );
            })}
          </div>
        </div>

        {/* Name Effects */}
        <div>
          <h3 className="font-pixel text-sm text-primary mb-3 flex items-center gap-2">
            <span>✨</span>
            <span>{lang === 'id' ? 'Efek Nama' : 'Name Effects'}</span>
            <span className="text-[8px] text-muted-foreground">({lang === 'id' ? 'Beli dengan XP' : 'Buy with XP'})</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {nameEffects.map(item => {
              const state = itemStates.get(item.id)!;
              return (
                <CosmeticItem
                  key={item.id}
                  item={item}
                  lang={lang}
                  xp={xp}
                  owned={state.owned}
                  equipped={state.equipped}
                  onBuy={() => handleBuy(item.id)}
                  onEquip={() => handleEquip(item.id)}
                  onUnequip={handleUnequipName}
                />
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => { playSfx('click'); onBack(); }}
        className="font-pixel text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        {'< '}{t('back', lang)}
      </button>
    </div>
  );
}
