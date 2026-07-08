'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedSpriteProps {
  /** Base path to sprite directory (e.g. '/pixel/tiger') */
  basePath: string;
  alt?: string;
  size?: number;
  eating?: boolean;
  className?: string;
}

// Animation configs: filename → { frames, speed }
const ANIM_CONFIG: Record<string, { frames: number; speed: number }> = {
  idle:       { frames: 9, speed: 900 },
  walk:       { frames: 9, speed: 200 },
  run:        { frames: 8, speed: 150 },
  eat:        { frames: 6, speed: 400 },
  attack:     { frames: 5, speed: 250 },
  climb:      { frames: 5, speed: 300 },
  jump:       { frames: 7, speed: 200 },
  hurt:       { frames: 4, speed: 300 },
  die:        { frames: 3, speed: 500 },
  expressions:{ frames: 7, speed: 400 },
};

const FRAME_SIZE = 160; // canvas size per frame

export default function AnimatedSprite({
  basePath,
  alt = 'Sprite',
  size = 200,
  eating = false,
  className = '',
}: AnimatedSpriteProps) {
  const [animState, setAnimState] = useState('idle');
  const [frame, setFrame] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Switch to eating
  useEffect(() => {
    if (eating) {
      setAnimState('eat');
      if (eatTimeoutRef.current) clearTimeout(eatTimeoutRef.current);
      eatTimeoutRef.current = setTimeout(() => setAnimState('idle'), 2500);
    }
    return () => {
      if (eatTimeoutRef.current) clearTimeout(eatTimeoutRef.current);
    };
  }, [eating]);

  // Animation loop
  useEffect(() => {
    const config = ANIM_CONFIG[animState] || ANIM_CONFIG.idle;
    let idx = 0;
    setFrame(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      idx = (idx + 1) % config.frames;
      setFrame(idx);
    }, config.speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [animState]);

  const config = ANIM_CONFIG[animState] || ANIM_CONFIG.idle;
  const sheetSrc = `${basePath}/${animState}.png`;
  const sheetWidth = FRAME_SIZE * config.frames;
  const sheetHeight = FRAME_SIZE;

  // Background position for horizontal strip
  const bgX = config.frames > 1 ? (frame / (config.frames - 1)) * 100 : 0;

  return (
    <div
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${sheetSrc})`,
        backgroundSize: `${(sheetWidth / FRAME_SIZE) * 100}% 100%`,
        backgroundPosition: `${bgX}% 0%`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        cursor: 'pointer',
      }}
      onClick={() => {
        setAnimState('expressions');
        setTimeout(() => setAnimState('idle'), 3000);
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
