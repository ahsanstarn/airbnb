'use client';

import { useEffect } from 'react';

export default function MouseTilt() {
  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = ((e.clientX / window.innerWidth) - 0.5) * 2;
          const y = ((e.clientY / window.innerHeight) - 0.5) * 2;
          document.documentElement.style.setProperty('--mouse-x', String(x));
          document.documentElement.style.setProperty('--mouse-y', String(y));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
}
