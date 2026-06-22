import { NextResponse } from "next/server";
import { getLevelBrackets } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const brackets = await getLevelBrackets();

  return NextResponse.json({ data: brackets });
}
