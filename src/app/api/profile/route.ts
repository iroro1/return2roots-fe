import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, updateProfile } from "@/lib/profile-store";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to view profile." }, { status: 401 });
  }
  const profile = getProfile(session.user.id);
  return NextResponse.json({ profile: profile ?? null });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to update profile." }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      displayName?: string;
      origin?: string;
      interests?: string;
      language?: "en" | "fr";
      imageUrl?: string | null;
    };
    const profile = updateProfile(session.user.id, {
      displayName: body.displayName !== undefined ? (body.displayName?.trim() || undefined) : undefined,
      origin: body.origin !== undefined ? (body.origin?.trim() || undefined) : undefined,
      interests: body.interests !== undefined ? (body.interests?.trim() || undefined) : undefined,
      language: body.language === "en" || body.language === "fr" ? body.language : undefined,
      imageUrl: body.imageUrl !== undefined ? (body.imageUrl?.trim() || undefined) : undefined,
    });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
