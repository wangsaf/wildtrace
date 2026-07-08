'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

interface GsapTigerProps {
  size?: number;
  eating?: boolean;
  className?: string;
}

export default function GsapTiger({ size = 300, eating = false, className = '' }: GsapTigerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [state, setState] = useState<'idle' | 'walk' | 'eat' | 'happy' | 'blink'>('idle');

  // Idle breathing + subtle movement
  const playIdle = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    // Kill existing animations
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Body breathing
    tl.to(svg.querySelector('#body'), {
      scaleY: 1.02,
      transformOrigin: 'center bottom',
      duration: 2,
      ease: 'sine.inOut',
    }, 0);

    // Chest expansion
    tl.to(svg.querySelector('#chest'), {
      scaleX: 1.03,
      transformOrigin: 'center center',
      duration: 2,
      ease: 'sine.inOut',
    }, 0);

    // Head subtle bob
    tl.to(svg.querySelector('#head'), {
      y: -2,
      rotation: 1,
      transformOrigin: 'center bottom',
      duration: 2.5,
      ease: 'sine.inOut',
    }, 0);

    // Tail sway
    tl.to(svg.querySelector('#tail'), {
      rotation: 8,
      transformOrigin: 'left center',
      duration: 3,
      ease: 'sine.inOut',
    }, 0);

    // Ear twitch (left)
    tl.to(svg.querySelector('#ear-left'), {
      rotation: -5,
      transformOrigin: 'bottom center',
      duration: 1.5,
      ease: 'sine.inOut',
    }, 0.5);

    // Ear twitch (right)
    tl.to(svg.querySelector('#ear-right'), {
      rotation: 5,
      transformOrigin: 'bottom center',
      duration: 1.5,
      ease: 'sine.inOut',
    }, 0.8);

    // Front left leg subtle
    tl.to(svg.querySelector('#leg-front-left'), {
      rotation: -1,
      transformOrigin: 'top center',
      duration: 2,
      ease: 'sine.inOut',
    }, 0);

    // Front right leg subtle
    tl.to(svg.querySelector('#leg-front-right'), {
      rotation: 1,
      transformOrigin: 'top center',
      duration: 2,
      ease: 'sine.inOut',
    }, 0.5);

    tlRef.current = tl;
  }, []);

  // Blink animation
  const playBlink = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const eyes = svg.querySelectorAll('.eye-lid');

    gsap.to(eyes, {
      scaleY: 0.1,
      transformOrigin: 'center center',
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });
  }, []);

  // Random blink every 3-6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (state === 'idle') playBlink();
    }, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [state, playBlink]);

  // Walking animation
  const playWalk = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({ repeat: -1 });

    // Body sway
    tl.to(svg.querySelector('#body'), {
      x: 3,
      y: -3,
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0);

    // Head bob
    tl.to(svg.querySelector('#head'), {
      y: -4,
      x: 2,
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0);

    // Front left leg walk
    tl.to(svg.querySelector('#leg-front-left'), {
      rotation: -25,
      transformOrigin: 'top center',
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0);

    // Front right leg walk (opposite phase)
    tl.to(svg.querySelector('#leg-front-right'), {
      rotation: 25,
      transformOrigin: 'top center',
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0.2);

    // Back left leg walk
    tl.to(svg.querySelector('#leg-back-left'), {
      rotation: 20,
      transformOrigin: 'top center',
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0.1);

    // Back right leg walk (opposite phase)
    tl.to(svg.querySelector('#leg-back-right'), {
      rotation: -20,
      transformOrigin: 'top center',
      duration: 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0.3);

    // Tail wag while walking
    tl.to(svg.querySelector('#tail'), {
      rotation: 15,
      transformOrigin: 'left center',
      duration: 0.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0);

    tlRef.current = tl;
  }, []);

  // Eating animation
  const playEat = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({ repeat: 2 });

    // Head goes down
    tl.to(svg.querySelector('#head'), {
      y: 20,
      rotation: 15,
      transformOrigin: 'center bottom',
      duration: 0.5,
      ease: 'power2.out',
    }, 0);

    // Mouth opens
    tl.to(svg.querySelector('#mouth'), {
      scaleY: 2,
      transformOrigin: 'center top',
      duration: 0.3,
      ease: 'power2.out',
    }, 0.3);

    // Jaw drops
    tl.to(svg.querySelector('#jaw'), {
      y: 8,
      rotation: -10,
      transformOrigin: 'top center',
      duration: 0.3,
      ease: 'power2.out',
    }, 0.3);

    // Chew (head bobs while eating)
    tl.to(svg.querySelector('#head'), {
      y: 18,
      rotation: 12,
      duration: 0.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 3,
    }, 0.8);

    // Mouth chews
    tl.to(svg.querySelector('#jaw'), {
      y: 4,
      rotation: -5,
      duration: 0.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 3,
    }, 0.8);

    // Head comes back up
    tl.to(svg.querySelector('#head'), {
      y: 0,
      rotation: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 2);

    // Mouth closes
    tl.to(svg.querySelector('#jaw'), {
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 2.2);

    // Mouth closes
    tl.to(svg.querySelector('#mouth'), {
      scaleY: 1,
      duration: 0.3,
      ease: 'power2.inOut',
    }, 2.2);

    // Tail wags happily while eating
    tl.to(svg.querySelector('#tail'), {
      rotation: 20,
      transformOrigin: 'left center',
      duration: 0.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, 0);

    tlRef.current = tl;
  }, []);

  // Happy/jump animation
  const playHappy = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline();

    // Jump up
    tl.to(svg.querySelector('#body'), {
      y: -30,
      scaleY: 0.9,
      scaleX: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    }, 0);

    // Front legs tuck
    tl.to(svg.querySelector('#leg-front-left'), {
      rotation: -40,
      y: -10,
      transformOrigin: 'top center',
      duration: 0.3,
      ease: 'power2.out',
    }, 0);

    tl.to(svg.querySelector('#leg-front-right'), {
      rotation: 40,
      y: -10,
      transformOrigin: 'top center',
      duration: 0.3,
      ease: 'power2.out',
    }, 0);

    // Back legs tuck
    tl.to(svg.querySelector('#leg-back-left'), {
      rotation: 30,
      y: -5,
      transformOrigin: 'top center',
      duration: 0.3,
      ease: 'power2.out',
    }, 0);

    tl.to(svg.querySelector('#leg-back-right'), {
      rotation: -30,
      y: -5,
      transformOrigin: 'top center',
      duration: 0.3,
      ease: 'power2.out',
    }, 0);

    // Head excited
    tl.to(svg.querySelector('#head'), {
      y: -15,
      rotation: -5,
      duration: 0.3,
      ease: 'power2.out',
    }, 0);

    // Tail wags fast
    tl.to(svg.querySelector('#tail'), {
      rotation: 30,
      transformOrigin: 'left center',
      duration: 0.15,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 4,
    }, 0);

    // Come back down
    tl.to(svg.querySelector('#body'), {
      y: 0,
      scaleY: 1,
      scaleX: 1,
      duration: 0.4,
      ease: 'bounce.out',
    }, 0.4);

    tl.to(svg.querySelector('#leg-front-left'), {
      rotation: 0,
      y: 0,
      duration: 0.4,
      ease: 'bounce.out',
    }, 0.4);

    tl.to(svg.querySelector('#leg-front-right'), {
      rotation: 0,
      y: 0,
      duration: 0.4,
      ease: 'bounce.out',
    }, 0.4);

    tl.to(svg.querySelector('#leg-back-left'), {
      rotation: 0,
      y: 0,
      duration: 0.4,
      ease: 'bounce.out',
    }, 0.4);

    tl.to(svg.querySelector('#leg-back-right'), {
      rotation: 0,
      y: 0,
      duration: 0.4,
      ease: 'bounce.out',
    }, 0.4);

    tl.to(svg.querySelector('#head'), {
      y: 0,
      rotation: 0,
      duration: 0.4,
      ease: 'bounce.out',
    }, 0.4);

    // Return to idle
    tl.call(() => playIdle(), [], 1.5);

    tlRef.current = tl;
  }, [playIdle]);

  // Handle eating prop
  useEffect(() => {
    if (eating) {
      setState('eat');
      playEat();
      const timeout = setTimeout(() => {
        setState('idle');
        playIdle();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [eating, playEat, playIdle]);

  // Initialize idle animation
  useEffect(() => {
    playIdle();
    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [playIdle]);

  return (
    <div
      className={`inline-block cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => {
        if (!eating) {
          setState('walk');
          playWalk();
        }
      }}
      onMouseLeave={() => {
        if (!eating) {
          setState('idle');
          playIdle();
        }
      }}
      onClick={() => {
        setState('happy');
        playHappy();
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 400 350"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Tail */}
        <g id="tail">
          <path
            d="M80 200 Q30 180 20 140 Q15 120 25 110 Q35 100 45 110 Q50 120 45 140 Q40 160 60 180"
            fill="#E88C30"
            stroke="#1a1a2e"
            strokeWidth="2.5"
          />
          <path
            d="M25 110 Q20 100 25 95 Q30 90 35 95 Q38 100 35 108"
            fill="#1a1a2e"
            stroke="none"
          />
        </g>

        {/* Back legs */}
        <g id="leg-back-left">
          <path
            d="M140 250 L130 300 Q128 310 135 315 L150 315 Q155 310 150 300 L155 260"
            fill="#E88C30"
            stroke="#1a1a2e"
            strokeWidth="2.5"
          />
          <path d="M130 310 L150 310 L150 315 L130 315 Z" fill="#1a1a2e" />
        </g>
        <g id="leg-back-right">
          <path
            d="M170 250 L160 300 Q158 310 165 315 L180 315 Q185 310 180 300 L185 260"
            fill="#D47A28"
            stroke="#1a1a2e"
            strokeWidth="2.5"
          />
          <path d="M160 310 L180 310 L180 315 L160 315 Z" fill="#1a1a2e" />
        </g>

        {/* Body */}
        <g id="body">
          {/* Main body */}
          <ellipse cx="200" cy="210" rx="90" ry="55" fill="#E88C30" stroke="#1a1a2e" strokeWidth="2.5" />

          {/* Chest/belly */}
          <g id="chest">
            <ellipse cx="230" cy="220" rx="50" ry="40" fill="#F5D6B8" stroke="none" />
          </g>

          {/* Stripes on body */}
          <path d="M140 190 Q145 200 140 210" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M160 185 Q165 195 160 205" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M180 183 Q185 193 180 203" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M200 182 Q205 192 200 202" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M220 183 Q225 193 220 203" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M240 185 Q245 195 240 205" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M255 190 Q260 200 255 210" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Front legs */}
        <g id="leg-front-left">
          <path
            d="M230 240 L220 300 Q218 310 225 315 L240 315 Q245 310 240 300 L245 255"
            fill="#E88C30"
            stroke="#1a1a2e"
            strokeWidth="2.5"
          />
          <path d="M220 310 L240 310 L240 315 L220 315 Z" fill="#1a1a2e" />
        </g>
        <g id="leg-front-right">
          <path
            d="M260 240 L250 300 Q248 310 255 315 L270 315 Q275 310 270 300 L275 255"
            fill="#D47A28"
            stroke="#1a1a2e"
            strokeWidth="2.5"
          />
          <path d="M250 310 L270 310 L270 315 L250 315 Z" fill="#1a1a2e" />
        </g>

        {/* Head */}
        <g id="head">
          {/* Head shape */}
          <ellipse cx="310" cy="160" rx="55" ry="50" fill="#E88C30" stroke="#1a1a2e" strokeWidth="2.5" />

          {/* Face white area */}
          <ellipse cx="320" cy="175" rx="35" ry="30" fill="#F5D6B8" stroke="none" />

          {/* Stripes on head */}
          <path d="M280 140 Q285 148 280 156" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M295 135 Q300 143 295 151" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M325 135 Q330 143 325 151" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
          <path d="M340 140 Q345 148 340 156" fill="none" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />

          {/* Ears */}
          <g id="ear-left">
            <path d="M270 120 L260 95 L280 110 Z" fill="#E88C30" stroke="#1a1a2e" strokeWidth="2.5" />
            <path d="M268 115 L263 100 L275 112 Z" fill="#F5D6B8" stroke="none" />
          </g>
          <g id="ear-right">
            <path d="M345 120 L355 95 L335 110 Z" fill="#E88C30" stroke="#1a1a2e" strokeWidth="2.5" />
            <path d="M347 115 L352 100 L340 112 Z" fill="#F5D6B8" stroke="none" />
          </g>

          {/* Eyes */}
          <g>
            {/* Left eye */}
            <ellipse cx="295" cy="155" rx="10" ry="11" fill="white" stroke="#1a1a2e" strokeWidth="2" />
            <ellipse cx="297" cy="155" rx="5" ry="6" fill="#1a1a2e" />
            <ellipse cx="299" cy="153" rx="2" ry="2" fill="white" />
            {/* Eye lid (for blink) */}
            <ellipse className="eye-lid" cx="295" cy="155" rx="11" ry="12" fill="#E88C30" stroke="none" style={{ opacity: 0 }} />

            {/* Right eye */}
            <ellipse cx="330" cy="155" rx="10" ry="11" fill="white" stroke="#1a1a2e" strokeWidth="2" />
            <ellipse cx="332" cy="155" rx="5" ry="6" fill="#1a1a2e" />
            <ellipse cx="334" cy="153" rx="2" ry="2" fill="white" />
            {/* Eye lid (for blink) */}
            <ellipse className="eye-lid" cx="330" cy="155" rx="11" ry="12" fill="#E88C30" stroke="none" style={{ opacity: 0 }} />
          </g>

          {/* Nose */}
          <path d="M310 175 L305 180 L315 180 Z" fill="#1a1a2e" />
          <ellipse cx="310" cy="182" rx="8" ry="4" fill="#F5D6B8" stroke="none" />

          {/* Mouth */}
          <g id="mouth">
            <path d="M302 188 Q310 193 318 188" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Jaw (for eating animation) */}
          <g id="jaw">
            <path d="M300 188 Q310 195 320 188 Q315 200 310 200 Q305 200 300 188" fill="#F5D6B8" stroke="#1a1a2e" strokeWidth="1.5" />
          </g>

          {/* Whiskers */}
          <line x1="280" y1="178" x2="250" y2="172" stroke="#1a1a2e" strokeWidth="1" />
          <line x1="280" y1="182" x2="248" y2="182" stroke="#1a1a2e" strokeWidth="1" />
          <line x1="280" y1="186" x2="250" y2="192" stroke="#1a1a2e" strokeWidth="1" />
          <line x1="340" y1="178" x2="370" y2="172" stroke="#1a1a2e" strokeWidth="1" />
          <line x1="340" y1="182" x2="372" y2="182" stroke="#1a1a2e" strokeWidth="1" />
          <line x1="340" y1="186" x2="370" y2="192" stroke="#1a1a2e" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
