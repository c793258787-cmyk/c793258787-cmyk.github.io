import { NextResponse } from "next/server";
import { getItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getItems();

  return NextResponse.json({ data: items });
}
