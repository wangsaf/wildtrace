'use client';

import { useEffect, useRef, useState } from 'react';

interface CursorProps {
  habitat?: 'forest' | 'ocean' | 'arctic';
}

const cursors: Record<string, { emoji: string; label: string }> = {
  forest: { emoji: '🐻', label: 'Bear' },
  ocean: { emoji: '🪼', label: 'Jellyfish' },
  arctic: { emoji: '❄️', label: 'Snowflake' },
};

export default function CustomCursor({ habitat = 'forest' }: CursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      trailX += (mouseX - trailX) * 0.08;
      trailY += (mouseY - trailY) * 0.08;

      cursor.style.transform = `translate(${cursorX - 12}px, ${cursorY - 12}px)`;
      trail.style.transform = `translate(${trailX - 20}px, ${trailY - 20}px)`;

      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  const cursorData = cursors[habitat] || cursors.forest;

  return (
    <>
      {/* Trail glow */}
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          opacity: visible ? 0.4 : 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: habitat === 'forest'
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent)'
            : habitat === 'ocean'
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)'
            : 'radial-gradient(circle, rgba(148, 163, 184, 0.4), transparent)',
          filter: 'blur(8px)',
        }}
      />
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span className="text-2xl select-none">{cursorData.emoji}</span>
      </div>
      <style jsx global>{`
        * { cursor: none !important; }
        @media (max-width: 768px) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}
