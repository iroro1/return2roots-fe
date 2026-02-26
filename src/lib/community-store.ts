/**
 * In-memory store for community posts, likes, and comments.
 * Replace with DB (e.g. Prisma + Postgres) for production.
 */

export type CommunityComment = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
};

const MAX_IMAGES_PER_POST = 5;

export type CommunityPost = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string | null;
  content: string;
  /** Up to 5 image URLs. Legacy: imageUrl still supported for backward compat. */
  imageUrls?: string[];
  imageUrl?: string;
  createdAt: string;
  likeIds: string[];
  comments: CommunityComment[];
};

const posts: CommunityPost[] = [];

function nanoid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getPosts(): CommunityPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPostsByUser(userId: string): CommunityPost[] {
  return getPosts().filter((p) => p.userId === userId);
}

export function getPostById(id: string): CommunityPost | null {
  return posts.find((p) => p.id === id) ?? null;
}

export function addPost(data: {
  userId: string;
  userName: string;
  userEmail: string | null;
  content: string;
  imageUrl?: string;
  imageUrls?: string[];
}): CommunityPost {
  const urls = Array.isArray(data.imageUrls)
    ? data.imageUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0).slice(0, MAX_IMAGES_PER_POST)
    : data.imageUrl?.trim()
      ? [data.imageUrl.trim()]
      : undefined;
  const post: CommunityPost = {
    id: nanoid("post"),
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail ?? null,
    content: data.content.trim(),
    imageUrls: urls?.length ? urls : undefined,
    createdAt: new Date().toISOString(),
    likeIds: [],
    comments: [],
  };
  posts.push(post);
  return post;
}

export function toggleLike(postId: string, userId: string): CommunityPost | null {
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  const idx = post.likeIds.indexOf(userId);
  if (idx >= 0) post.likeIds.splice(idx, 1);
  else post.likeIds.push(userId);
  return { ...post };
}

export function addComment(
  postId: string,
  data: { userId: string; userName: string; content: string }
): CommunityComment | null {
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;
  const comment: CommunityComment = {
    id: nanoid("comment"),
    userId: data.userId,
    userName: data.userName,
    content: data.content.trim(),
    createdAt: new Date().toISOString(),
  };
  post.comments.push(comment);
  return comment;
}

// ——— Follows (in-memory). Replace with DB for production. ———
// follows[].followerId follows follows[].followingId
const follows: { followerId: string; followingId: string }[] = [];

export function addFollow(followerId: string, followingId: string): void {
  if (followerId === followingId) return;
  if (follows.some((f) => f.followerId === followerId && f.followingId === followingId)) return;
  follows.push({ followerId, followingId });
}

export function removeFollow(followerId: string, followingId: string): void {
  const idx = follows.findIndex((f) => f.followerId === followerId && f.followingId === followingId);
  if (idx >= 0) follows.splice(idx, 1);
}

export function getFollowingIds(followerId: string): string[] {
  return follows.filter((f) => f.followerId === followerId).map((f) => f.followingId);
}

export function getFollowersIds(followingId: string): string[] {
  return follows.filter((f) => f.followingId === followingId).map((f) => f.followerId);
}

export function isFollowing(followerId: string, followingId: string): boolean {
  return follows.some((f) => f.followerId === followerId && f.followingId === followingId);
}

/** Posts from people the user follows, plus the user's own posts (chronological). */
export function getPostsFromFollowed(followerId: string): CommunityPost[] {
  const followingIds = new Set(getFollowingIds(followerId));
  followingIds.add(followerId); // include own posts
  return getPosts().filter((p) => followingIds.has(p.userId));
}
