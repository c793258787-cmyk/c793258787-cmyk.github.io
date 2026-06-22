import { NextResponse } from "next/server";
import { getDrops } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const drops = await getDrops();

  return NextResponse.json({ data: drops });
}
