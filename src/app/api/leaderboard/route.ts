import { NextResponse } from 'next/server';
import { getLeaderboard, getUserRank } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user = url.searchParams.get('user');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const leaderboard = await getLeaderboard(limit);
    
    let userRank = null;
    if (user) {
      userRank = await getUserRank(user);
    }

    return NextResponse.json({ leaderboard, userRank });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 });
  }
}
