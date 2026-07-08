'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface AnimatedSpriteProps {
  sheetSrc: string;
  alt?: string;
  size?: number;
  eating?: boolean;
  cols?: number;
  rows?: number;
  className?: string;
}

// Animation states with slow, natural speeds
const ANIMATIONS: Record<string, { startFrame: number; count: number; speed: number }> = {
  idle:    { startFrame: 0, count: 4, speed: 900 },
  walk:    { startFrame: 4, count: 6, speed: 250 },
  eat:     { startFrame: 10, count: 4, speed: 400 },
  happy:   { startFrame: 14, count: 4, speed: 350 },
  hurt:    { startFrame: 18, count: 2, speed: 300 },
  special: { startFrame: 20, count: 4, speed: 450 },
};

export default function AnimatedSprite({
  sheetSrc,
  alt = 'Sprite',
  size = 200,
  eating = false,
  cols = 6,
  rows = 4,
  className = '',
}: AnimatedSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animState, setAnimState] = useState<string>('idle');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Switch to eating when prop changes
  useEffect(() => {
    if (eating) {
      setAnimState('eat');
      const eatAnim = ANIMATIONS.eat;
      setTimeout(() => setAnimState('idle'), eatAnim.speed * eatAnim.count);
    }
  }, [eating]);

  // Animation loop
  useEffect(() => {
    const anim = ANIMATIONS[animState] || ANIMATIONS.idle;
    const frames = Array.from({ length: anim.count }, (_, i) => anim.startFrame + i);

    let frameIdx = 0;
    setCurrentFrame(frames[0]);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      frameIdx = (frameIdx + 1) % frames.length;
      setCurrentFrame(frames[frameIdx]);
    }, anim.speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [animState]);

  // Background position calculation
  const col = currentFrame % cols;
  const row = Math.floor(currentFrame / cols);
  const bgX = cols > 1 ? (col / (cols - 1)) * 100 : 0;
  const bgY = rows > 1 ? (row / (rows - 1)) * 100 : 0;

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${sheetSrc})`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${bgX}% ${bgY}%`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        cursor: 'pointer',
      }}
      onClick={() => {
        setAnimState('happy');
        setTimeout(() => setAnimState('idle'), ANIMATIONS.happy.speed * ANIMATIONS.happy.count);
      }}
      onMouseEnter={() => {
        if (!eating) setAnimState('walk');
      }}
      onMouseLeave={() => {
        if (!eating) setAnimState('idle');
      }}
      title={alt}
    />
  );
}
