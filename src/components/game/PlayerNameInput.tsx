import { useState } from 'react';
import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';

interface Props {
  lang: Language;
  onSubmit: (name: string) => void;
  onBack: () => void;
  initialName?: string;
}

export default function PlayerNameInput({ lang, onSubmit, onBack, initialName = '' }: Props) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const badWords = [
    'anjing', 'babi', 'bangsat', 'bajingan', 'kontol', 'memek', 'ngentot', 'fuck', 'shit', 
    'bitch', 'ass', 'damn', 'hell', 'dick', 'pussy', 'cock', 'cunt', 'bastard', 'asshole',
    'tolol', 'goblok', 'bodoh', 'idiot', 'stupid', 'jancok', 'cok', 'tai', 'puki', 'perek'
  ];

  const sanitizeName = (input: string) => {
    // Remove HTML tags, scripts, and dangerous characters
    return input
      .replace(/[<>'"&]/g, '') // Remove HTML special chars
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 20);
  };

  const containsBadWord = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
  };

  const handleSubmit = () => {
    const sanitized = sanitizeName(name);
    
    if (!sanitized) {
      setError(t('nameRequired', lang));
      playSfx('wrong');
      return;
    }
    
    if (sanitized.length < 3) {
      setError(lang === 'id' ? '❌ Nama minimal 3 karakter!' : '❌ Name must be at least 3 characters!');
      playSfx('wrong');
      return;
    }
    
    if (sanitized.length > 20) {
      setError(lang === 'id' ? '❌ Nama maksimal 20 karakter!' : '❌ Name must be at most 20 characters!');
      playSfx('wrong');
      return;
    }
    
    // Only allow alphanumeric, spaces, and basic punctuation
    if (!/^[a-zA-Z0-9\s._-]+$/.test(sanitized)) {
      setError(lang === 'id' ? '❌ Hanya huruf, angka, spasi, dan ._- yang diperbolehkan!' : '❌ Only letters, numbers, spaces, and ._- allowed!');
      playSfx('wrong');
      return;
    }
    
    if (containsBadWord(sanitized)) {
      setError(lang === 'id' ? '❌ Nama tidak pantas!' : '❌ Inappropriate name!');
      playSfx('wrong');
      return;
    }
    
    playSfx('click');
    onSubmit(sanitized);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      <h2 className="font-pixel text-xl sm:text-2xl text-primary glow-text mb-8">
        {t('enterName', lang)}
      </h2>

      <div className="w-full max-w-xs space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-pixel text-sm">{'>'}</span>
          <input
            type="text"
            id="player-name"
            name="playerName"
            autoComplete="username"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('namePlaceholder', lang)}
            maxLength={20}
            className="w-full bg-background border border-primary text-primary font-mono text-sm
              pl-8 pr-4 py-3 outline-none focus:glow-border placeholder:text-muted-foreground"
          />
        </div>
        {error && <p className="text-destructive font-pixel text-[10px]">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-3 border border-primary bg-background text-primary font-pixel text-xs
            hover:bg-primary hover:text-primary-foreground transition-all glow-border active:scale-95"
        >
          {t('letsGo', lang)}
        </button>
      </div>

      <button
        onClick={() => { playSfx('click'); onBack(); }}
        className="mt-8 font-pixel text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        {'< '}{t('back', lang)}
      </button>
    </div>
  );
}

