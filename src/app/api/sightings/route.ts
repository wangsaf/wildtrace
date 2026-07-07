import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT s.*, sp.name as species_name, sp.habitat FROM sightings s LEFT JOIN species sp ON s.species_id = sp.id ORDER BY s.created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reporter_name, species_id, location, notes } = body;

    if (!reporter_name || !species_id || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO sightings (reporter_name, species_id, location, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [reporter_name, species_id, location, notes]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Failed to create sighting' }, { status: 500 });
  }
}
