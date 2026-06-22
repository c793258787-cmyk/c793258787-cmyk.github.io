import { NextResponse } from "next/server";
import { getMonster } from "@/lib/data";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: { slug: string };
};

export async function GET(_request: Request, { params }: RouteContext) {
  const monster = await getMonster(params.slug);

  if (!monster) {
    return NextResponse.json({ error: "未找到怪物" }, { status: 404 });
  }

  return NextResponse.json({ data: monster });
}
