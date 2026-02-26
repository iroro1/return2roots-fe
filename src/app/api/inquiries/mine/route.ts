import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInquiriesByUser } from "@/lib/inquiries-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const inquiries = getInquiriesByUser(session.user.id);
  return NextResponse.json({ inquiries });
}
