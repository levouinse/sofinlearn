import { useState } from 'react';
import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';

interface Props {
  initialLang: Language;
  onClose: (selectedLang: Language) => void;
}

export default function Tutorial({ initialLang, onClose }: Props) {
  const [lang, setLang] = useState<Language>(initialLang);

  const tutorialEN = [
    { icon: '🎮', title: 'Welcome!', text: 'Learn programming through interactive quizzes.' },
    { icon: '⭐', title: 'Stars & Score', text: 'Complete levels to earn Score and stars. Get 3 stars for perfect scores!' },
    { icon: '🏆', title: 'Score System', text: 'Score is used to buy cosmetics in shop and appears on the leaderboard when you complete all stages!' },
    { icon: '💎', title: 'XP System', text: 'XP is earned from levels and used to buy health potions and hints in the shop.' },
    { icon: '❤️', title: 'Health System', text: 'You have 3 hearts. Wrong answers cost 1 heart. Game over at 0 hearts!' },
    { icon: '💡', title: 'Hints', text: 'Use hints to eliminate 2 wrong answers. Buy them in the shop with XP!' },
    { icon: '🛒', title: 'Shop', text: 'Buy items with XP and cosmetics with Score. Customize your name on the leaderboard!' },
    { icon: '📚', title: 'Progression', text: 'Complete all 10 levels in Stage 1 to unlock Stage 2!' },
    { icon: '💾', title: 'Backup Progress', text: 'Export progress in Settings to backup. To restore: Import file → Enter same username → Start game → Import again in Settings.' },
  ];

  const tutorialID = [
    { icon: '🎮', title: 'Selamat Datang!', text: 'Belajar programming lewat kuis interaktif.' },
    { icon: '⭐', title: 'Bintang & Score', text: 'Selesaikan level untuk dapat Score dan bintang. Raih 3 bintang untuk skor sempurna!' },
    { icon: '🏆', title: 'Sistem Score', text: 'Score dipakai untuk beli kosmetik di shop dan muncul di leaderboard saat kamu selesaikan semua stage!' },
    { icon: '💎', title: 'Sistem XP', text: 'XP didapat dari level dan dipakai untuk beli ramuan nyawa dan hint di shop.' },
    { icon: '❤️', title: 'Sistem Nyawa', text: 'Kamu punya 3 nyawa. Jawaban salah = -1 nyawa. Game over di 0 nyawa!' },
    { icon: '💡', title: 'Petunjuk', text: 'Pakai hint untuk hilangkan 2 jawaban salah. Beli di shop pakai XP!' },
    { icon: '🛒', title: 'Toko', text: 'Beli item pakai XP dan kosmetik pakai Score. Customize nama kamu di leaderboard!' },
    { icon: '📚', title: 'Progresi', text: 'Selesaikan 10 level di Stage 1 untuk buka Stage 2!' },
    { icon: '💾', title: 'Backup Progress', text: 'Export progress di Settings untuk backup. Untuk restore: Import file → Masukkan username yang sama → Mulai game → Import lagi di Settings.' },
  ];

  const tutorial = lang === 'id' ? tutorialID : tutorialEN;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4 py-8">
      <div className="border border-primary bg-card p-6 rounded max-w-2xl w-full glow-border max-h-[90vh] overflow-hidden flex flex-col">
        <h2 className="font-pixel text-xl text-primary glow-text mb-4 text-center">
          📖 {lang === 'id' ? 'Tutorial' : 'Tutorial'}
        </h2>

        {/* Language Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {(['en', 'id'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                playSfx('click');
                setLang(l);
              }}
              className={`font-pixel text-xs px-4 py-2 border transition-all ${
                lang === l
                  ? 'border-primary text-primary glow-border'
                  : 'border-muted-foreground text-muted-foreground hover:border-primary'
              }`}
            >
              {l === 'en' ? '🇬🇧 EN' : '🇮🇩 ID'}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          {tutorial.map((item, idx) => (
            <div key={idx} className="border border-border bg-background/50 p-4 rounded">
              <div className="flex gap-3 items-center mb-2">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <h3 className="font-pixel text-xs text-primary">{item.title}</h3>
              </div>
              <p className="font-mono text-xs text-foreground leading-relaxed pl-11">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            playSfx('click');
            onClose(lang);
          }}
          className="w-full py-3 border border-primary text-primary font-pixel text-xs
            hover:bg-primary hover:text-primary-foreground transition-all glow-border"
        >
          {lang === 'id' ? '✓ Mengerti!' : '✓ Got it!'}
        </button>
      </div>
    </div>
  );
}
