'use client';

import { useState, useRef, useEffect } from 'react';

interface FoodItem {
  id: string;
  emoji: string;
  label: string;
}

const FOODS: FoodItem[] = [
  { id: 'meat', emoji: '🥩', label: 'Meat' },
  { id: 'fish', emoji: '🐟', label: 'Fish' },
  { id: 'fruit', emoji: '🍌', label: 'Fruit' },
  { id: 'vegetable', emoji: '🥬', label: 'Vegetable' },
  { id: 'carrot', emoji: '🥕', label: 'Carrot' },
  { id: 'shrimp', emoji: '🦐', label: 'Shrimp' },
];

interface FeedZoneProps {
  speciesId: number;
  speciesName: string;
  onFeed?: (food: string) => void;
}

export default function FeedZone({ speciesId, speciesName, onFeed }: FeedZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragFood, setDragFood] = useState<FoodItem | null>(null);
  const [feedAnimation, setFeedAnimation] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(false);
  const [feedCount, setFeedCount] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);
  const heartIdRef = useRef(0);

  useEffect(() => {
    // Get initial feed count
    fetch(`/api/species`)
      .then(r => r.json())
      .then(species => {
        const s = species.find((sp: any) => sp.id === speciesId);
        if (s) setFeedCount(s.feed_count || 0);
      })
      .catch(() => {});
  }, [speciesId]);

  const handleDragStart = (food: FoodItem) => {
    setIsDragging(true);
    setDragFood(food);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragFood(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragFood || cooldown) return;

    setIsDragging(false);
    setDragFood(null);
    setFeedAnimation(true);

    // Spawn hearts
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: heartIdRef.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 30 + 30,
    }));
    setHearts(prev => [...prev, ...newHearts]);

    // Remove hearts after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 1500);

    // Reset animation
    setTimeout(() => setFeedAnimation(false), 800);

    // API call
    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: 'Guest',
          species_id: speciesId,
          food_type: dragFood.id,
        }),
      });

      if (res.ok) {
        setFeedCount(prev => prev + 1);
        setMessage(`Yummy! ${speciesName} loves ${dragFood.emoji} ${dragFood.label}!`);
        onFeed?.(dragFood.id);
      } else if (res.status === 429) {
        setMessage('Too fast! Wait a few seconds...');
      } else {
        setMessage('Failed to feed. Try again!');
      }
    } catch {
      setMessage('Connection error!');
    }

    // Cooldown
    setCooldown(true);
    setTimeout(() => {
      setCooldown(false);
      setMessage('');
    }, 5000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Feed Counter */}
      <div className="text-center">
        <div className="stat-value text-3xl">{feedCount}</div>
        <div className="stat-label">Total Feeds</div>
      </div>

      {/* Drop Zone */}
      <div
        ref={dropRef}
        className={`relative rounded-2xl border-3 border-dashed p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-[var(--green)] bg-[var(--green-light)] scale-105'
            : 'border-[var(--outline)] bg-white/50'
        } ${feedAnimation ? 'animate-bounce' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Floating Hearts */}
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              animation: 'float-up 1.5s ease-out forwards',
            }}
          >
            ❤️
          </div>
        ))}

        <div className="text-4xl mb-2">
          {isDragging ? '😋' : feedAnimation ? '😍' : '🐾'}
        </div>
        <p className="font-bold text-[var(--text)] text-sm">
          {isDragging
            ? `Drop ${dragFood?.emoji} here!`
            : feedAnimation
            ? 'Yummy!'
            : 'Drag food here to feed'}
        </p>

        {/* Sprite sheet animation placeholder */}
        <div className="mt-4 w-32 h-32 mx-auto rounded-2xl bg-white border-2 border-[var(--outline)] flex items-center justify-center text-5xl"
             style={{
               animation: feedAnimation ? 'wiggle 0.3s ease-in-out infinite' : undefined,
             }}>
          {speciesId === 1 ? '🐅' : speciesId === 2 ? '🐋' : speciesId === 3 ? '🐆' : '🐾'}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="card p-3 text-center" style={{ background: '#dcfce7' }}>
          <p className="font-bold text-sm text-[var(--green-dark)]">{message}</p>
        </div>
      )}

      {/* Food Items */}
      <div>
        <p className="text-xs font-bold text-[var(--text-soft)] mb-3 uppercase tracking-wider">
          🍽️ Drag food to feed
        </p>
        <div className="grid grid-cols-3 gap-2">
          {FOODS.map(food => (
            <div
              key={food.id}
              draggable={!cooldown}
              onDragStart={() => handleDragStart(food)}
              onDragEnd={handleDragEnd}
              className={`card p-3 text-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
                cooldown ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              <div className="text-2xl mb-1">{food.emoji}</div>
              <div className="text-xs font-bold text-[var(--text-soft)]">{food.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooldown indicator */}
      {cooldown && (
        <div className="text-center">
          <div className="inline-block badge badge-orange">
            ⏳ Wait 5 seconds...
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
