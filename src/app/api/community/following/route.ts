import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getFollowingIds } from "@/lib/community-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ following: [] });
  }
  const following = getFollowingIds(session.user.id);
  return NextResponse.json({ following });
}
