import { countMovies } from '@/server/services/movieService';
import { countTools } from '@/server/services/toolService';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.API_KEY ;

    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { statusCode: 401, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    try {
      const [movieCount, toolCount] = await Promise.all([countMovies(), countTools()]);
      return NextResponse.json(
        {
          status: 'ok',
          timestamp: new Date().toISOString(),
          movieCount,
          toolCount,
        },
        { status: 200 }
      );
    } catch (innerError: any) {
      console.error('Health check DB error:', innerError);
      return NextResponse.json(
        { status: 'degraded', message: 'DB error', details: innerError.message },
        { status: 503 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // allow POST for some schedulers that only support POST pings
  return GET(request);
}
