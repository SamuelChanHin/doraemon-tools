import { NextResponse } from 'next/server';
import { DoraemonTaskService } from '../../../../../server/services/taskService';
import { invalidateKeys } from '../../../../../server/api-utils';

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.API_KEY || 'api-key-default';
    
    // Verify API key from x-api-key header
    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { statusCode: 401, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Run task in background
    (async () => {
      try {
        await DoraemonTaskService.scrapeMovies();
        await invalidateKeys(['DORAEMON_MOVIE_COUNT']);
      } catch (error) {
        console.error('Background movie scraping failed:', error);
      }
    })();

    return NextResponse.json(
      { statusCode: 202, success: true, message: 'Movie scraping task started' },
      { status: 202 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { statusCode: 500, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Keep POST as a proxy for compatibility with schedulers that POST
export async function POST(request: Request) {
  return GET(request);
}
