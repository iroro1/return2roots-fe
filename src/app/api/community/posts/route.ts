import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPosts, getPostsByUser, getPostsFromFollowed, addPost } from "@/lib/community-store";
import { getProfile } from "@/lib/profile-store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "1";
  const feed = searchParams.get("feed");
  const userId = searchParams.get("userId")?.trim();
  const session = await getServerSession(authOptions);

  if (mine && session?.user?.id) {
    const posts = getPostsByUser(session.user.id);
    return NextResponse.json({ posts });
  }
  if (feed === "following" && session?.user?.id) {
    const posts = getPostsFromFollowed(session.user.id);
    return NextResponse.json({ posts });
  }
  if (userId) {
    const posts = getPostsByUser(userId);
    return NextResponse.json({ posts });
  }
  const posts = getPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to post." }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { content?: string; imageUrl?: string; imageUrls?: string[] };
    const content = typeof body.content === "string" ? body.content : "";
    if (!content.trim()) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0).slice(0, 5)
      : typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? [body.imageUrl.trim()]
        : undefined;
    const profile = getProfile(session.user.id);
    const userName = profile?.displayName ?? session.user.name ?? session.user.email ?? "Member";
    const post = addPost({
      userId: session.user.id,
      userName,
      userEmail: session.user.email ?? null,
      content: content.trim(),
      imageUrls,
    });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
