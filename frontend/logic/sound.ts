// Using Web Audio API for procedural sound effects to avoid external assets and ensure zero-latency
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext | null => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // Browsers require user interaction to resume audio context
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

const playOscillator = (
  freq: number, 
  type: OscillatorType, 
  duration: number, 
  startTime: number, 
  volume: number = 0.1
) => {
  const ctx = getContext();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  // Envelope for smooth sound
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playMoveSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  // Crisp "wood block" or "tap" sound
  playOscillator(800, 'sine', 0.08, ctx.currentTime, 0.15);
};

export const playHoverSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  // Very subtle high tick
  playOscillator(1200, 'sine', 0.03, ctx.currentTime, 0.03);
};

export const playMiniWinSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Positive ascending chime (Major Triad)
  playOscillator(523.25, 'sine', 0.15, now, 0.1);       // C5
  playOscillator(659.25, 'sine', 0.15, now + 0.1, 0.1); // E5
  playOscillator(783.99, 'sine', 0.3,  now + 0.2, 0.1); // G5
};

export const playGameWinSound = () => {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  // Victory fanfare
  playOscillator(523.25, 'triangle', 0.15, now, 0.15);        // C5
  playOscillator(659.25, 'triangle', 0.15, now + 0.15, 0.15); // E5
  playOscillator(783.99, 'triangle', 0.15, now + 0.30, 0.15); // G5
  playOscillator(1046.50, 'triangle', 0.8, now + 0.45, 0.2);  // C6
};