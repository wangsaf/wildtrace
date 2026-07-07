import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const speciesCount = await pool.query('SELECT COUNT(*) FROM species');
    const sightingsCount = await pool.query('SELECT COUNT(*) FROM sightings');
    const reportersCount = await pool.query('SELECT COUNT(DISTINCT reporter_name) FROM sightings');
    const recentSightings = await pool.query(
      'SELECT s.*, sp.name as species_name, sp.habitat FROM sightings s LEFT JOIN species sp ON s.species_id = sp.id ORDER BY s.created_at DESC LIMIT 5'
    );

    return NextResponse.json({
      species: parseInt(speciesCount.rows[0].count),
      sightings: parseInt(sightingsCount.rows[0].count),
      reporters: parseInt(reportersCount.rows[0].count),
      recent: recentSightings.rows,
    });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
