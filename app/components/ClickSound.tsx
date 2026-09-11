'use client';

import { useEffect, useRef } from 'react';

export default function ClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const playClick = () => {
      try {
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        const ctx = ctxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
      } catch {}
    };

    document.addEventListener('mousedown', playClick);
    return () => document.removeEventListener('mousedown', playClick);
  }, []);

  return null;
}
