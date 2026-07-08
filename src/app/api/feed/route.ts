import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { addFeedScore, incrementSpeciesFeed, checkRateLimit, publishFeed } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_name, species_id, food_type } = body;

    if (!user_name || !species_id || !food_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rate limit: 1 feed per 5 seconds per user
    const allowed = await checkRateLimit(`feed:${user_name}`, 5);
    if (!allowed) {
      return NextResponse.json({ error: 'Too fast! Wait 5 seconds.' }, { status: 429 });
    }

    // Insert feed record
    const result = await pool.query(
      'INSERT INTO feeds (user_name, species_id, food_type) VALUES ($1, $2, $3) RETURNING *',
      [user_name, species_id, food_type]
    );

    // Update species feed count in DB
    await pool.query(
      'UPDATE species SET feed_count = feed_count + 1 WHERE id = $1',
      [species_id]
    );

    // Update Redis
    await incrementSpeciesFeed(species_id);
    await addFeedScore(user_name);

    // Get species name
    const species = await pool.query('SELECT name FROM species WHERE id = $1', [species_id]);
    const speciesName = species.rows[0]?.name || 'Unknown';

    // Publish real-time update
    await publishFeed({
      type: 'feed',
      user: user_name,
      species: speciesName,
      species_id,
      food: food_type,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json({ error: 'Failed to create feed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT f.*, s.name as species_name, s.habitat 
       FROM feeds f 
       LEFT JOIN species s ON f.species_id = s.id 
       ORDER BY f.created_at DESC 
       LIMIT 50`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
