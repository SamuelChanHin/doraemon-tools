import { NextResponse } from 'next/server';
import { countTools } from '../../../../../server/services/toolService';

export async function GET() {
  try {
    const c = await countTools();
    return NextResponse.json({ statusCode: 200, data: c });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
