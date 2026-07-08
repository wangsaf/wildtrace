'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface AnimatedSpriteProps {
  sheetSrc: string;
  alt: string;
  size?: number;
  eating?: boolean;
}

const FRAMES = {
  idle:    [0, 1, 2, 3],
  blink:   [4, 5],
  breathe: [6, 7, 8, 9],
  eat:     [12, 13, 14, 15],
  happy:   [16, 17],
  wave:    [18, 19],
};

const COLS = 5;

export default function AnimatedSprite({ sheetSrc, alt, size = 256, eating }: AnimatedSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const getFramePosition = (frameIndex: number) => {
    const col = frameIndex % COLS;
    const row = Math.floor(frameIndex / COLS);
    return {
      x: (col / (COLS - 1)) * 100,
      y: (row / 3) * 100,
    };
  };

  const playAnimation = useCallback((frames: number[], speed = 300, loop = false) => {
    if (animRef.current) clearInterval(animRef.current);
    let idx = 0;
    setCurrentFrame(frames[0]);
    animRef.current = setInterval(() => {
      idx++;
      if (idx >= frames.length) {
        if (loop) { idx = 0; }
        else { clearInterval(animRef.current!); return; }
      }
      setCurrentFrame(frames[idx % frames.length]);
    }, speed);
  }, []);

  // Idle cycle with random events
  useEffect(() => {
    playAnimation(FRAMES.idle, 800, true);

    const randomEvent = setInterval(() => {
      if (eating) return;
      const rand = Math.random();
      if (rand < 0.3) playAnimation(FRAMES.blink, 200);
      else if (rand < 0.5) playAnimation(FRAMES.breathe, 400);
    }, 4000);

    return () => {
      clearInterval(randomEvent);
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [playAnimation, eating]);

  // Eating prop triggers eat animation
  useEffect(() => {
    if (eating) {
      playAnimation(FRAMES.eat, 250);
    }
  }, [eating, playAnimation]);

  const handleClick = () => {
    playAnimation(FRAMES.happy, 300);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 1500);
  };

  const pos = getFramePosition(currentFrame);

  return (
    <div
      className="relative inline-block cursor-pointer select-none"
      onMouseEnter={() => {
        setIsHovered(true);
        if (!eating) playAnimation(FRAMES.wave, 300);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {showHearts && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 animate-bounce z-10">
          {['💕', '💖', '💕'].map((h, i) => (
            <span key={i} className="text-2xl" style={{ animationDelay: `${i * 100}ms` }}>{h}</span>
          ))}
        </div>
      )}

      <div
        className="rounded-3xl shadow-lg border-4 border-white transition-transform duration-200"
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${sheetSrc})`,
          backgroundSize: `${COLS * 100}% ${4 * 100}%`,
          backgroundPosition: `${pos.x}% ${pos.y}%`,
          backgroundRepeat: 'no-repeat',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          imageRendering: 'auto',
        }}
        title={`Click ${alt}!`}
      />
    </div>
  );
}
