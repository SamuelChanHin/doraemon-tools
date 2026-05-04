import { NextResponse } from 'next/server';
import { randomTool } from '../../../../../server/services/toolService';

export async function GET() {
  try {
    const t = await randomTool();
    return NextResponse.json({ statusCode: 200, data: t });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
