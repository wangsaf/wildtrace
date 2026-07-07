import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM species ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
