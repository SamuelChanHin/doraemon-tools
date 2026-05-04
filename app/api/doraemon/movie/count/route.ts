import { NextResponse } from 'next/server';
import { countMovies } from '../../../../../server/services/movieService';

export async function GET() {
  try {
    const c = await countMovies();
    return NextResponse.json({ statusCode: 200, data: c });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
