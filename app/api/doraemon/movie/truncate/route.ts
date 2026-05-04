import { NextResponse } from 'next/server';
import { truncateMovies } from '../../../../../server/services/movieService';
import { invalidateKeys } from '../../../../../server/api-utils';

export async function POST() {
  try {
    await truncateMovies();
    await invalidateKeys(['DORAEMON_MOVIE_COUNT']);
    return NextResponse.json({ statusCode: 200, success: true });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
