import { useState } from 'react';
import { t, Language } from '@/lib/i18n';
import { playSfx } from '@/lib/audioEngine';

interface Props {
  lang: Language;
  musicOn: boolean;
  playerName: string;
  onToggleMusic: () => void;
  onChangeLanguage: (lang: Language) => void;
  onResetProgress: () => void;
  onImportProgress: (data: string) => void;
  onBack: () => void;
}

export default function Settings({ lang, musicOn, playerName, onToggleMusic, onChangeLanguage, onResetProgress, onImportProgress, onBack }: Props) {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [importData, setImportData] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = () => {
    try {
      const users = localStorage.getItem('sofinlearn_users');
      if (users) {
        const allUsers = JSON.parse(users);
        const userData = allUsers[playerName];
        if (userData) {
          const exportData = JSON.stringify(userData, null, 2);
          const blob = new Blob([exportData], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sofinlearn_${playerName}_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          playSfx('levelup');
        } else {
          playSfx('wrong');
        }
      }
    } catch (err) {
      playSfx('wrong');
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      onImportProgress(importData);
      setImportSuccess(true);
      setTimeout(() => {
        setShowImportDialog(false);
        setImportData('');
        setImportSuccess(false);
      }, 2000);
    } catch (err) {
      playSfx('wrong');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      <h2 className="font-pixel text-2xl sm:text-3xl text-primary glow-text mb-10">
        {t('settings', lang)}
      </h2>

      <div className="w-full max-w-sm space-y-6">
        {/* Music Toggle */}
        <div className="flex items-center justify-between border border-border p-4 bg-card rounded">
          <span className="font-pixel text-xs text-foreground">🔊 {t('music', lang)}</span>
          <button
            onClick={() => { playSfx('click'); onToggleMusic(); }}
            className={`font-pixel text-xs px-4 py-2 border transition-all ${musicOn
                ? 'border-primary text-primary glow-border'
                : 'border-muted-foreground text-muted-foreground'
              }`}
          >
            {musicOn ? t('on', lang) : t('off', lang)}
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between border border-border p-4 bg-card rounded">
          <span className="font-pixel text-xs text-foreground">🌐 {t('language', lang)}</span>
          <div className="flex gap-2">
            {(['en', 'id'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => { playSfx('click'); onChangeLanguage(l); }}
                className={`font-pixel text-xs px-3 py-2 border transition-all ${lang === l
                    ? 'border-primary text-primary glow-border'
                    : 'border-muted-foreground text-muted-foreground hover:border-primary'
                  }`}
              >
                {l === 'en' ? 'EN' : 'ID'}
              </button>
            ))}
          </div>
        </div>

        {/* Export/Import Progress */}
        <div className="border border-accent p-4 bg-card rounded">
          <p className="font-pixel text-[10px] text-muted-foreground mb-3">💾 Backup Progress</p>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full font-pixel text-xs px-4 py-2 border border-accent text-accent
                hover:bg-accent hover:text-accent-foreground transition-all"
            >
              📥 Export Progress
            </button>
            <button
              onClick={() => {
                playSfx('click');
                setShowImportDialog(true);
              }}
              className="w-full font-pixel text-xs px-4 py-2 border border-accent text-accent
                hover:bg-accent hover:text-accent-foreground transition-all"
            >
              📤 Import Progress
            </button>
          </div>
        </div>

        {/* Reset Progress */}
        <div className="border border-destructive p-4 bg-card rounded">
          <p className="font-pixel text-[10px] text-muted-foreground mb-3">⚠️ Reset all progress</p>
          <button
            onClick={() => { 
              playSfx('click');
              setShowResetDialog(true);
            }}
            className="w-full font-pixel text-xs px-4 py-2 border border-destructive text-destructive
              hover:bg-destructive hover:text-destructive-foreground transition-all"
          >
            🔄 Reset Progress
          </button>
        </div>

        {/* About Developer */}
        <div className="border border-accent p-4 bg-card rounded">
          <p className="font-pixel text-[10px] text-muted-foreground mb-3">👨‍💻 About Developer</p>
          <button
            onClick={() => {
              playSfx('click');
              setShowAboutDialog(true);
            }}
            className="w-full font-pixel text-xs px-4 py-2 border border-accent text-accent
              hover:bg-accent hover:text-accent-foreground transition-all"
          >
            ℹ️ Developer Info
          </button>
        </div>
      </div>

      <button
        onClick={() => { playSfx('click'); onBack(); }}
        className="mt-10 font-pixel text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        {'< '}{t('back', lang)}
      </button>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="border border-destructive bg-card p-6 rounded max-w-sm w-full">
            <h3 className="font-pixel text-sm text-destructive mb-4 text-center">⚠️ Warning</h3>
            <p className="font-pixel text-[10px] text-foreground mb-6 text-center leading-relaxed">
              Reset all progress? This cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  playSfx('click');
                  setShowResetDialog(false);
                }}
                className="flex-1 py-2 border border-border text-muted-foreground font-pixel text-xs
                  hover:border-primary hover:text-primary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  playSfx('wrong');
                  setShowResetDialog(false);
                  onResetProgress();
                }}
                className="flex-1 py-2 border border-destructive bg-destructive text-destructive-foreground 
                  font-pixel text-xs hover:bg-destructive/80 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="border border-accent bg-card p-6 rounded max-w-sm w-full">
            <h3 className="font-pixel text-sm text-accent mb-4 text-center">📤 Import Progress</h3>
            
            {importSuccess ? (
              <div className="text-center py-8">
                <p className="font-pixel text-lg text-primary glow-text mb-2">✓ Success!</p>
                <p className="font-pixel text-[10px] text-muted-foreground">Progress imported</p>
              </div>
            ) : (
              <>
                <p className="font-pixel text-[10px] text-muted-foreground mb-4 text-center">
                  Select file or paste JSON:
                </p>
                
                {/* File Input */}
                <label className="w-full mb-3 block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                    name="fileInput"
                  />
                  <div className="w-full py-2 px-4 border border-accent text-accent font-pixel text-xs
                    hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer text-center">
                    📁 Select JSON File
                  </div>
                </label>

                <p className="font-pixel text-[10px] text-muted-foreground mb-2 text-center">or</p>

                <textarea
                  id="import-data"
                  name="importData"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder='{"currentStage":1,...}'
                  className="w-full h-24 bg-background border border-border text-foreground font-mono text-xs
                    p-2 outline-none focus:border-accent resize-none mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      playSfx('click');
                      setShowImportDialog(false);
                      setImportData('');
                    }}
                    className="flex-1 py-2 border border-border text-muted-foreground font-pixel text-xs
                      hover:border-primary hover:text-primary transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importData.trim()}
                    className="flex-1 py-2 border border-accent bg-accent text-accent-foreground 
                      font-pixel text-xs hover:bg-accent/80 transition-all disabled:opacity-50"
                  >
                    Import
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* About Developer Dialog */}
      {showAboutDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="border border-accent bg-card p-6 rounded max-w-md w-full">
            <h3 className="font-pixel text-lg text-accent mb-4 text-center glow-text">
              👨‍💻 Developer
            </h3>
            
            <div className="space-y-4 mb-6">
              {/* GitHub */}
              <a
                href="https://github.com/levouinse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-border bg-background rounded
                  hover:border-primary hover:bg-secondary transition-all group"
              >
                <span className="text-2xl">🐙</span>
                <div className="flex-1">
                  <p className="font-pixel text-[10px] text-muted-foreground">GitHub</p>
                  <p className="font-mono text-sm text-primary group-hover:glow-text">levouinse</p>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/himogelaru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-border bg-background rounded
                  hover:border-primary hover:bg-secondary transition-all group"
              >
                <span className="text-2xl">📸</span>
                <div className="flex-1">
                  <p className="font-pixel text-[10px] text-muted-foreground">Instagram</p>
                  <p className="font-mono text-sm text-primary group-hover:glow-text">@himogelaru</p>
                </div>
                <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </a>

              {/* Discord */}
              <div className="flex items-center gap-3 p-3 border border-border bg-background rounded">
                <span className="text-2xl">💬</span>
                <div className="flex-1">
                  <p className="font-pixel text-[10px] text-muted-foreground">Discord</p>
                  <p className="font-mono text-sm text-primary">himogelaru</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('himogelaru');
                    playSfx('correct');
                  }}
                  className="text-xs font-pixel text-accent hover:text-primary transition-colors"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="font-pixel text-[8px] text-muted-foreground">
                Made with ❤️ by Sofinco
              </p>
            </div>

            <button
              onClick={() => {
                playSfx('click');
                setShowAboutDialog(false);
              }}
              className="w-full py-2 border border-accent text-accent font-pixel text-xs
                hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

