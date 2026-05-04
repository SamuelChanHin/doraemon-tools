import { NextResponse } from 'next/server';
import { randomMovie } from '../../../../../server/services/movieService';

export async function GET() {
  try {
    const r = await randomMovie();
    return NextResponse.json({ statusCode: 200, data: r });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
