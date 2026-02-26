import { NextResponse } from "next/server";
import { getProfile } from "@/lib/profile-store";
import { getFollowersIds, getFollowingIds } from "@/lib/community-store";
import { getPostsByUser } from "@/lib/community-store";

/** Public profile: display name, origin, interests, image, stats. No email or language. */
export type PublicProfile = {
  userId: string;
  displayName?: string;
  origin?: string;
  interests?: string;
  imageUrl?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
};

type Params = { params: Promise<{ userId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { userId } = await params;
  const id = userId?.trim();
  if (!id) {
    return NextResponse.json({ error: "User ID required." }, { status: 400 });
  }
  const profile = getProfile(id);
  const followers = getFollowersIds(id);
  const following = getFollowingIds(id);
  const posts = getPostsByUser(id);
  const publicProfile: PublicProfile = {
    userId: id,
    displayName: profile?.displayName,
    origin: profile?.origin,
    interests: profile?.interests,
    imageUrl: profile?.imageUrl,
    postsCount: posts.length,
    followersCount: followers.length,
    followingCount: following.length,
  };
  return NextResponse.json({ profile: publicProfile });
}
