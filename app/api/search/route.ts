import { NextRequest, NextResponse } from "next/server";
import { searchDatabase } from "@/lib/services/search.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";

  try {
    return NextResponse.json(await searchDatabase(query));
  } catch (error) {
    console.error("搜索请求失败：", error);
    return NextResponse.json({ monsters: [], items: [], error: "搜索服务暂时不可用" }, { status: 500 });
  }
}
