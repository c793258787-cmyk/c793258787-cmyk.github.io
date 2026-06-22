import { NextResponse } from "next/server";
import { getMonsters } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const monsters = await getMonsters();

  return NextResponse.json({ data: monsters });
}
