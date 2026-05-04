import { NextResponse } from 'next/server';
import { scrapeMoviesFromSource, insertMovies } from '../../../../../server/services/movieService';
import { invalidateKeys } from '../../../../../server/api-utils';

export async function POST() {
  try {
    (async () => {
      let page = 1;
      while (true) {
        const items = await scrapeMoviesFromSource(page);
        if (!items || !items.length) break;
        await insertMovies(items);
        page += 1;
      }
      await invalidateKeys(['DORAEMON_MOVIE_COUNT']);
    })();

    return NextResponse.json({ statusCode: 202, success: true }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
