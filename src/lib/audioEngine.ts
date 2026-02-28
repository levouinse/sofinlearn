// Programmatic synthwave/chiptune music generator
let audioCtx: AudioContext | null = null;
let isPlaying = false;
let intervalId: number | null = null;
let gainNode: GainNode | null = null;

const NOTE_FREQS: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99,
};

// Catchy synthwave melody loop
const MELODY = [
  'E4', 'G4', 'A4', 'B4', 'A4', 'G4', 'E4', 'D4',
  'E4', 'G4', 'A4', 'C5', 'B4', 'A4', 'G4', 'E4',
  'A4', 'B4', 'C5', 'D5', 'C5', 'B4', 'A4', 'G4',
  'E4', 'G4', 'A4', 'B4', 'G4', 'A4', 'E4', 'E4',
];

const BASS = [
  'C4', 'C4', 'A4', 'A4', 'F4', 'F4', 'G4', 'G4',
];

function playNote(ctx: AudioContext, freq: number, startTime: number, duration: number, type: OscillatorType = 'square', volume: number = 0.08) {
  if (!gainNode) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  env.gain.setValueAtTime(volume, startTime);
  env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(env);
  env.connect(gainNode);
  osc.start(startTime);
  osc.stop(startTime + duration);
  osc.onended = () => {
    osc.disconnect();
    env.disconnect();
  };
}

function scheduleLoop() {
  if (!audioCtx || !isPlaying || !gainNode) return;
  const now = audioCtx.currentTime;
  const bpm = 140;
  const noteLen = 60 / bpm / 2;

  // Melody
  MELODY.forEach((note, i) => {
    const freq = NOTE_FREQS[note];
    if (freq) playNote(audioCtx!, freq, now + i * noteLen, noteLen * 0.8, 'square', 0.06);
  });

  // Bass (slower)
  BASS.forEach((note, i) => {
    const freq = NOTE_FREQS[note];
    if (freq) playNote(audioCtx!, freq / 2, now + i * noteLen * 4, noteLen * 3.5, 'sawtooth', 0.04);
  });

  // Schedule next loop
  const loopDuration = MELODY.length * noteLen * 1000;
  intervalId = window.setTimeout(scheduleLoop, loopDuration - 100);
}

export function startMusic() {
  if (isPlaying) return;
  
  // Clear any existing interval
  if (intervalId !== null) {
    clearTimeout(intervalId);
    intervalId = null;
  }
  
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  // Create fresh gain node
  if (gainNode) {
    gainNode.disconnect();
  }
  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.connect(audioCtx.destination);
  
  isPlaying = true;
  scheduleLoop();
}

export function stopMusic() {
  isPlaying = false;
  
  if (intervalId !== null) {
    clearTimeout(intervalId);
    intervalId = null;
  }
  
  // Disconnect gain node completely to stop all sound
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
}

export function playSfx(type: 'correct' | 'wrong' | 'click' | 'levelup') {
  const ctx = audioCtx || new AudioContext();
  if (!audioCtx) {
    audioCtx = ctx;
    gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.connect(ctx.destination);
  }

  // Debounce click sounds
  const now = Date.now();
  const lastPlayKey = `sfx_${type}`;
  const lastPlayTime = (window as Window & { [key: string]: number })[lastPlayKey] || 0;
  
  if (type === 'click' && now - lastPlayTime < 100) {
    return;
  }
  
  (window as Window & { [key: string]: number })[lastPlayKey] = now;

  const sfxGain = ctx.createGain();
  sfxGain.connect(ctx.destination);
  const nowTime = ctx.currentTime;

  const cleanup = (osc: OscillatorNode, gain: GainNode) => {
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  };

  if (type === 'correct') {
    sfxGain.gain.setValueAtTime(0.15, nowTime);
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(523, nowTime);
    osc.frequency.setValueAtTime(659, nowTime + 0.1);
    osc.frequency.setValueAtTime(784, nowTime + 0.2);
    sfxGain.gain.exponentialRampToValueAtTime(0.001, nowTime + 0.4);
    osc.connect(sfxGain);
    osc.start(nowTime);
    osc.stop(nowTime + 0.4);
    cleanup(osc, sfxGain);
  } else if (type === 'wrong') {
    sfxGain.gain.setValueAtTime(0.12, nowTime);
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, nowTime);
    osc.frequency.exponentialRampToValueAtTime(100, nowTime + 0.3);
    sfxGain.gain.exponentialRampToValueAtTime(0.001, nowTime + 0.3);
    osc.connect(sfxGain);
    osc.start(nowTime);
    osc.stop(nowTime + 0.3);
    cleanup(osc, sfxGain);
  } else if (type === 'click') {
    sfxGain.gain.setValueAtTime(0.08, nowTime);
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, nowTime);
    sfxGain.gain.exponentialRampToValueAtTime(0.001, nowTime + 0.05);
    osc.connect(sfxGain);
    osc.start(nowTime);
    osc.stop(nowTime + 0.05);
    cleanup(osc, sfxGain);
  } else if (type === 'levelup') {
    sfxGain.gain.setValueAtTime(0.15, nowTime);
    [523, 659, 784, 1047].forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, nowTime + i * 0.15);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.12, nowTime + i * 0.15);
      g.gain.exponentialRampToValueAtTime(0.001, nowTime + i * 0.15 + 0.2);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(nowTime + i * 0.15);
      osc.stop(nowTime + i * 0.15 + 0.2);
      cleanup(osc, g);
    });
  }
}

