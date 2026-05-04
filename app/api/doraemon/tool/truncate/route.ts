import { NextResponse } from 'next/server';
import { truncateTools } from '../../../../../server/services/toolService';
import { invalidateKeys } from '../../../../../server/api-utils';

export async function POST() {
  try {
    await truncateTools();
    await invalidateKeys(['DORAEMON_TOOL_COUNT']);
    return NextResponse.json({ statusCode: 200, success: true });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
