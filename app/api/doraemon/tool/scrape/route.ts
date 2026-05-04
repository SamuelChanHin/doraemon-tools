import { NextResponse } from 'next/server';
import { scrapeToolsFromSource, insertTools } from '../../../../../server/services/toolService';
import { invalidateKeys } from '../../../../../server/api-utils';

export async function POST() {
  try {
    // respond quickly and process in background
    (async () => {
      let page = 1;
      while (true) {
        const items = await scrapeToolsFromSource(page);
        if (!items || !items.length) break;
        await insertTools(items);
        page += 1;
      }
      await invalidateKeys(['DORAEMON_TOOL_COUNT']);
    })();

    return NextResponse.json({ statusCode: 202, success: true }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ statusCode: 500, message: error.message || 'Server error' }, { status: 500 });
  }
}
