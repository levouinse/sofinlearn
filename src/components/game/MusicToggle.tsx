import { memo } from 'react';
import { playSfx } from '@/lib/audioEngine';

interface Props {
  musicOn: boolean;
  onToggle: () => void;
}

const MusicToggle = memo(({ musicOn, onToggle }: Props) => {
  return (
    <button
      onClick={() => { playSfx('click'); onToggle(); }}
      className="fixed top-4 right-4 z-40 w-10 h-10 border border-border bg-card
        flex items-center justify-center text-lg hover:border-primary transition-all rounded"
      title={musicOn ? 'Mute' : 'Unmute'}
    >
      {musicOn ? '🔊' : '🔇'}
    </button>
  );
});

MusicToggle.displayName = 'MusicToggle';

export default MusicToggle;

