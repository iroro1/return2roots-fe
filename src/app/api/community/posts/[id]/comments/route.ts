import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addComment } from "@/lib/community-store";
import { getProfile } from "@/lib/profile-store";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to comment." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await req.json()) as { content?: string };
  const content = typeof body.content === "string" ? body.content : "";
  if (!content.trim()) {
    return NextResponse.json({ error: "Comment is required." }, { status: 400 });
  }
  const profile = getProfile(session.user.id);
  const userName = profile?.displayName ?? session.user.name ?? session.user.email ?? "Member";
  const comment = addComment(id, {
    userId: session.user.id,
    userName,
    content: content.trim(),
  });
  if (!comment) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ comment });
}
