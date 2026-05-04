import { getDataSource } from "@/server/database/data-source";
import { Movies } from "@/server/database/entity/movie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const ds = await getDataSource();
    const repo = ds.getRepository(Movies as any);
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
