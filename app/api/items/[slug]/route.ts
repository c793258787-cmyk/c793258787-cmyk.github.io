import { NextResponse } from "next/server";
import { getItem } from "@/lib/data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { slug: string };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const item = await getItem(params.slug);

  if (!item) {
    return NextResponse.json({ error: "未找到物品" }, { status: 404 });
  }

  return NextResponse.json({ data: item });
}
