"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { getInitials } from "@/lib/initials";
import type { CommunityPost } from "@/lib/community-store";
import type { PublicProfile } from "@/app/api/profile/[userId]/route";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = typeof params.userId === "string" ? params.userId : "";
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setNotFound(false);
    try {
      const [profileRes, postsRes] = await Promise.all([
        fetch(`/api/profile/${encodeURIComponent(userId)}`),
        fetch(`/api/community/posts?userId=${encodeURIComponent(userId)}`),
      ]);
      if (profileRes.ok) {
        const d = (await profileRes.json()) as { profile: PublicProfile };
        setProfile(d.profile);
      } else {
        setProfile(null);
      }
      if (postsRes.ok) {
        const d = (await postsRes.json()) as { posts: CommunityPost[] };
        setPosts(d.posts ?? []);
      } else {
        setPosts([]);
      }
      if (!profileRes.ok && !postsRes.ok) setNotFound(true);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    fetch("/api/community/following")
      .then((r) => (r.ok ? r.json() : { following: [] }))
      .then((d: { following?: string[] }) => setFollowingIds(new Set(d.following ?? [])))
      .catch(() => {});
  }, [status, session?.user?.id]);

  async function handleFollowToggle() {
    if (!session?.user?.id || userId === session.user.id || followLoading) return;
    setFollowLoading(true);
    const isFollowing = followingIds.has(userId);
    try {
      if (isFollowing) {
        await fetch(`/api/community/follow?userId=${encodeURIComponent(userId)}`, { method: "DELETE" });
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      } else {
        await fetch("/api/community/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        setFollowingIds((prev) => new Set([...prev, userId]));
      }
      if (profile) {
        setProfile((p) => p ? { ...p, followersCount: p.followersCount + (isFollowing ? -1 : 1) } : null);
      }
    } finally {
      setFollowLoading(false);
    }
  }

  const isOwnProfile = status === "authenticated" && session?.user?.id === userId;
  const displayName = profile?.displayName ?? (posts[0]?.userName) ?? "Member";
  const avatarUrl = profile?.imageUrl;
  const initial = getInitials(displayName, posts[0]?.userEmail ?? undefined);

  if (!userId) {
    router.replace("/community");
    return null;
  }

  if (loading) {
    return (
      <div className="shell page-inner">
        <Link href="/community" className="profile-back">← Back to community</Link>
        <div className="insta-profile insta-profile-loading">
          <div className="insta-avatar-skeleton" />
          <div className="insta-meta-skeleton">
            <div className="insta-name-skeleton" />
            <div className="insta-stats-skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound && !profile && posts.length === 0) {
    return (
      <div className="shell page-inner">
        <Link href="/community" className="profile-back">← Back to community</Link>
        <div className="card community-empty">
          <p className="muted" style={{ margin: 0 }}>This profile isn’t available.</p>
        </div>
      </div>
    );
  }

  const postsCount = profile?.postsCount ?? posts.length;
  const followersCount = profile?.followersCount ?? 0;
  const followingCount = profile?.followingCount ?? 0;

  return (
    <div className="shell page-inner">
      <Link href="/community" className="profile-back">← Back to community</Link>

      <div className="insta-profile">
        <div className="insta-header">
          <div className="insta-avatar-wrap">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" width={150} height={150} className="insta-avatar-img" unoptimized />
            ) : (
              <span className="insta-avatar-initials">{initial}</span>
            )}
          </div>
          <div className="insta-info">
            <div className="insta-name-row">
              <h1 className="insta-name">{displayName}</h1>
              {!isOwnProfile && status === "authenticated" && (
                <button
                  type="button"
                  className={`insta-btn ${followingIds.has(userId) ? "insta-btn-following" : "insta-btn-follow"}`}
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  aria-pressed={followingIds.has(userId)}
                >
                  {followLoading ? "…" : followingIds.has(userId) ? "Following" : "Follow"}
                </button>
              )}
              {isOwnProfile && (
                <Link href="/profile" className="insta-btn insta-btn-edit">
                  Edit profile
                </Link>
              )}
            </div>
            <div className="insta-stats">
              <span className="insta-stat"><strong>{postsCount}</strong> posts</span>
              <span className="insta-stat"><strong>{followersCount}</strong> followers</span>
              <span className="insta-stat"><strong>{followingCount}</strong> following</span>
            </div>
            {(profile?.origin || profile?.interests) && (
              <div className="insta-bio">
                <span className="insta-bio-name">{displayName}</span>
                {" · "}
                {[profile?.origin, profile?.interests].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>

        <div className="insta-grid-section">
          <div className="insta-grid-label">
            <span className="insta-grid-tab insta-grid-tab-active">Posts</span>
          </div>
          {posts.length === 0 ? (
            <div className="insta-grid-empty">
              <div className="insta-grid-empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="muted">{isOwnProfile ? "You haven’t posted yet." : "No posts yet."}</p>
            </div>
          ) : (
            <div className="insta-grid">
              {posts.map((post) => {
                const urls = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
                const thumb = urls[0];
                return (
                  <button
                    key={post.id}
                    type="button"
                    className="insta-grid-item"
                    onClick={() => setSelectedPost(post)}
                  >
                    {thumb ? (
                      <Image src={thumb} alt="" fill className="insta-grid-img" unoptimized sizes="(max-width: 768px) 33vw, 309px" />
                    ) : (
                      <span className="insta-grid-placeholder">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>Text</span>
                      </span>
                    )}
                    {urls.length > 1 && <span className="insta-grid-multi" aria-hidden>⊕</span>}
                    <span className="insta-grid-hover">
                      <span className="insta-grid-likes">♥ {post.likeIds.length}</span>
                      <span className="insta-grid-comments">💬 {post.comments.length}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <div className="insta-modal-overlay" onClick={() => setSelectedPost(null)} role="dialog" aria-modal="true" aria-label="Post">
          <div className="insta-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="insta-modal-close" onClick={() => setSelectedPost(null)} aria-label="Close">×</button>
            <div className="insta-modal-content">
              <div className="insta-modal-image">
                {(() => {
                  const urls = selectedPost.imageUrls?.length ? selectedPost.imageUrls : selectedPost.imageUrl ? [selectedPost.imageUrl] : [];
                  if (urls.length === 0) return <div className="insta-modal-text-only"><p>{selectedPost.content}</p></div>;
                  return (
                    <Image
                      src={urls[0]!}
                      alt=""
                      width={600}
                      height={600}
                      className="insta-modal-img"
                      unoptimized
                    />
                  );
                })()}
              </div>
              <div className="insta-modal-side">
                <div className="insta-modal-header">
                  {profile?.imageUrl ? (
                    <Image src={profile.imageUrl} alt="" width={32} height={32} className="insta-modal-avatar" unoptimized />
                  ) : (
                    <span className="insta-modal-avatar-initials">{getInitials(selectedPost.userName, selectedPost.userEmail)}</span>
                  )}
                  <span className="insta-modal-author">{selectedPost.userName}</span>
                </div>
                <div className="insta-modal-body">
                  <p className="insta-modal-caption">{selectedPost.content}</p>
                </div>
                <div className="insta-modal-actions">
                  <span>♥ {selectedPost.likeIds.length} likes</span>
                  <span>💬 {selectedPost.comments.length} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
