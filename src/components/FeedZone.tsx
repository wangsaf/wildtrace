'use client';

import { useState } from 'react';
import GsapTiger from '@/components/GsapTiger';
import AnimatedSprite from '@/components/AnimatedSprite';

interface FoodItem {
  id: string;
  emoji: string;
  label: string;
}

const FOODS: FoodItem[] = [
  { id: 'meat', emoji: '🥩', label: 'Meat' },
  { id: 'fish', emoji: '🐟', label: 'Fish' },
  { id: 'fruit', emoji: '🍌', label: 'Fruit' },
  { id: 'vegetable', emoji: '🥬', label: 'Veggies' },
  { id: 'carrot', emoji: '🥕', label: 'Carrot' },
  { id: 'shrimp', emoji: '🦐', label: 'Shrimp' },
];

interface FeedZoneProps {
  speciesId: number;
  speciesName: string;
  spriteBasePath: string | null;
}

export default function FeedZone({ speciesId, speciesName, spriteBasePath }: FeedZoneProps) {
  const [cooldown, setCooldown] = useState(false);
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [eating, setEating] = useState(false);
  const [hearts, setHearts] = useState<{ id: number }[]>([]);
  const heartIdRef = { current: 0 };

  const handleFeed = async (food: FoodItem) => {
    if (cooldown) return;

    // Trigger eating animation
    setEating(true);
    setTimeout(() => setEating(false), 3000);

    // Spawn hearts
    const newHearts = Array.from({ length: 5 }, () => ({ id: heartIdRef.current++ }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 2000);

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: 'Guest',
          species_id: speciesId,
          food_type: food.id,
        }),
      });

      if (res.ok) {
        setMessage(`${food.emoji} Yummy! ${speciesName} loves ${food.label}!`);
      } else if (res.status === 429) {
        setMessage('⏳ Too fast! Wait a few seconds...');
      } else {
        setMessage('❌ Failed to feed. Try again!');
      }
    } catch {
      setMessage('❌ Connection error!');
    }

    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
      setMessage('');
    }, 5000);
  };

  // Determine which character to show
  const isTiger = speciesName.toLowerCase().includes('tiger');

  return (
    <div>
      {/* Character = drop target */}
      <div
        className="relative flex justify-center mb-4"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const foodId = e.dataTransfer.getData('text/plain');
          const food = FOODS.find(f => f.id === foodId);
          if (food) handleFeed(food);
        }}
      >
        {/* Drag hint */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-[var(--green)] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
              Drop here!
            </div>
          </div>
        )}

        {/* Hearts */}
        {hearts.map(h => (
          <div
            key={h.id}
            className="absolute text-2xl pointer-events-none z-20"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${20 + Math.random() * 30}%`,
              animation: 'float-up 2s ease-out forwards',
            }}
          >
            💖
          </div>
        ))}

        {/* The character */}
        {isTiger ? (
          <GsapTiger size={280} eating={eating} />
        ) : spriteBasePath ? (
          <AnimatedSprite
            basePath={spriteBasePath}
            alt={speciesName}
            size={200}
            eating={eating}
          />
        ) : (
          <div className="text-8xl">🐾</div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="text-center mb-3">
          <span className="inline-block bg-[var(--green-bg)] text-[var(--green-dark)] px-4 py-1.5 rounded-full text-sm font-bold">
            {message}
          </span>
        </div>
      )}

      {/* Food items - drag onto character */}
      <div className="grid grid-cols-3 gap-2">
        {FOODS.map(food => (
          <div
            key={food.id}
            draggable={!cooldown}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', food.id);
            }}
            className={`card p-3 text-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
              cooldown ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-1">{food.emoji}</div>
            <div className="text-xs font-bold text-[var(--text-soft)]">{food.label}</div>
          </div>
        ))}
      </div>

      {/* Cooldown */}
      {cooldown && (
        <div className="text-center mt-2">
          <span className="text-xs font-bold text-[var(--text-muted)]">⏳ Wait a few seconds...</span>
        </div>
      )}

      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
