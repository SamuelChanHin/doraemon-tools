import { DoraemonTaskService } from '@/server/services/taskService';
import { NextResponse } from 'next/server';

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

    // Run all tasks in background
    (async () => {
      try {
        console.log('[API] Starting full scraping task');
        const result = await DoraemonTaskService.scrapeAll();
        console.log('[API] Full scraping task completed:', result);
      } catch (error) {
        console.error('[API] Background scraping failed:', error);
      }
    })();

    return NextResponse.json(
      {
        statusCode: 202,
        success: true,
        message: 'All scraping tasks started (movies and tools)',
      },
      { status: 202 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { statusCode: 500, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// Keep POST as proxy for compatibility
export async function POST(request: Request) {
  return GET(request);
}
