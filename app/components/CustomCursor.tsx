'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Track mouse coordinates
  const mouseCoords = useRef({ x: 0, y: 0 });
  // Track interpolated position for lag/smoothness
  const cursorCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only run on desktop/devices with mouse pointer
    if (typeof window === 'undefined') return;
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth tracking loop using linear interpolation
    let animationFrameId: number;
    
    const updateCursor = () => {
      const lerpFactor = 0.15; // Lower = smoother lag, higher = tighter snap
      
      cursorCoords.current.x += (mouseCoords.current.x - cursorCoords.current.x) * lerpFactor;
      cursorCoords.current.y += (mouseCoords.current.y - cursorCoords.current.y) * lerpFactor;

      if (cursorRef.current) {
        // GPU accelerated translate3d
        cursorRef.current.style.transform = `translate3d(${cursorCoords.current.x}px, ${cursorCoords.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    // Global clickables event listeners
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.closest('.nav-link-button') ||
        target.closest('.mobile-bottom-nav-item') ||
        target.closest('.theme-toggle-btn') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Start requestAnimationFrame loop
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div 
      ref={cursorRef}
      className={`${styles.cursor} ${isHovering ? styles.hovering : ''} ${isVisible ? styles.visible : ''}`}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: isHovering ? '48px' : '16px',
        height: isHovering ? '48px' : '16px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'difference',
        background: isHovering ? 'rgba(255, 255, 255, 0.95)' : 'var(--accent, #b4542d)',
        opacity: isVisible ? 1 : 0,
        transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s, opacity 0.25s ease',
        transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)'
      }}
    />
  );
}
