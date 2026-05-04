import { NextResponse, NextRequest } from "next/server";
import { getDataSource } from "@/server/database/data-source";
import { Tools } from "@/server/database/entity/tools";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const ds = await getDataSource();
    const repo = ds.getRepository(Tools as any);
    const numId = Number(id);
    const item = await repo.findOneBy({ id: numId } as any);
    return NextResponse.json({ statusCode: 200, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { statusCode: 500, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
