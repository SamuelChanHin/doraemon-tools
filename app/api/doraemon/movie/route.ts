import { NextResponse } from 'next/server';
import { findMovies } from '../../../../server/services/movieService';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const pageSize = Number(url.searchParams.get('pageSize') || '10');
    const data = await findMovies({ page, pageSize });
    return NextResponse.json({ statusCode: 200, data });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
