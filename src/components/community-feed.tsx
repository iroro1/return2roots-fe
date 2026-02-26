"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { getInitials } from "@/lib/initials";
import type { CommunityPost as PostType } from "@/lib/community-store";
import type { ProfileExtension } from "@/lib/profile-store";

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

const MAX_POST_IMAGES = 5;
/** Client-side soft limit; server compresses to meet requirements */
const MAX_FILE_SIZE_CLIENT = 50 * 1024 * 1024; // 50MB – server will compress

type ViewMode = "all" | "mine" | "following";

function viewModeFromParams(searchParams: URLSearchParams): ViewMode {
  if (searchParams.get("mine") === "1") return "mine";
  if (searchParams.get("feed") === "following") return "following";
  return "all";
}

export function CommunityFeed() {
  // const { data: session, status } = useSession();
  // const searchParams = useSearchParams();
  // const [viewMode, setViewMode] = useState<ViewMode>(() => viewModeFromParams(searchParams));
  // const [posts, setPosts] = useState<PostType[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [content, setContent] = useState("");
  // const [imageFiles, setImageFiles] = useState<File[]>([]);
  // const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  // const [imageError, setImageError] = useState<string | null>(null);
  // const [submitting, setSubmitting] = useState(false);
  // const [commentByPost, setCommentByPost] = useState<Record<string, string>>({});
  // const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  // const [profile, setProfile] = useState<ProfileExtension | null>(null);
  // const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  // const [followLoading, setFollowLoading] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (status !== "authenticated" || !session?.user?.id) return;
  //   fetch("/api/profile")
  //     .then((r) => (r.ok ? r.json() : { profile: null }))
  //     .then((d: { profile: ProfileExtension | null }) => setProfile(d.profile ?? null))
  //     .catch(() => setProfile(null));
  // }, [status, session?.user?.id]);

  // const fetchFollowing = useCallback(async () => {
  //   if (status !== "authenticated" || !session?.user?.id) return;
  //   const res = await fetch("/api/community/following");
  //   if (res.ok) {
  //     const d = (await res.json()) as { following?: string[] };
  //     setFollowingIds(new Set(d.following ?? []));
  //   }
  // }, [status, session?.user?.id]);

  // useEffect(() => {
  //   if (status === "authenticated" && session?.user?.id) fetchFollowing();
  // }, [status, session?.user?.id, fetchFollowing]);

  // const fetchPosts = useCallback(async (mode: ViewMode) => {
  //   setLoading(true);
  //   let url = "/api/community/posts";
  //   if (mode === "mine") url += "?mine=1";
  //   else if (mode === "following") url += "?feed=following";
  //   const res = await fetch(url);
  //   if (res.ok) {
  //     const data = (await res.json()) as { posts: PostType[] };
  //     setPosts(data.posts ?? []);
  //   }
  //   setLoading(false);
  // }, []);

  // useEffect(() => {
  //   setViewMode(viewModeFromParams(searchParams));
  // }, [searchParams]);

  // useEffect(() => {
  //   fetchPosts(viewMode);
  // }, [viewMode, fetchPosts]);

  // function switchView(mode: ViewMode) {
  //   setViewMode(mode);
  //   const params = new URLSearchParams();
  //   if (mode === "mine") params.set("mine", "1");
  //   else if (mode === "following") params.set("feed", "following");
  //   const url = params.toString() ? `/community?${params}` : "/community";
  //   window.history.replaceState(null, "", url);
  // }

  // async function handleFollowToggle(targetUserId: string) {
  //   if (!session?.user?.id || session.user.id === targetUserId) return;
  //   setFollowLoading(targetUserId);
  //   const isFollowing = followingIds.has(targetUserId);
  //   try {
  //     if (isFollowing) {
  //       await fetch(`/api/community/follow?userId=${encodeURIComponent(targetUserId)}`, { method: "DELETE" });
  //       setFollowingIds((prev) => {
  //         const next = new Set(prev);
  //         next.delete(targetUserId);
  //         return next;
  //       });
  //     } else {
  //       await fetch("/api/community/follow", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ userId: targetUserId }),
  //       });
  //       setFollowingIds((prev) => new Set([...prev, targetUserId]));
  //     }
  //     if (viewMode === "following") fetchPosts("following");
  //   } finally {
  //     setFollowLoading(null);
  //   }
  // }

  // function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
  //   const newFiles = Array.from(e.target.files ?? []);
  //   setImageError(null);
  //   const validNew: File[] = [];
  //   for (const f of newFiles) {
  //     if (!f.type.startsWith("image/")) {
  //       setImageError("Please choose image files only.");
  //       if (e.target) e.target.value = "";
  //       return;
  //     }
  //     if (f.size > MAX_FILE_SIZE_CLIENT) {
  //       setImageError("File too large. Max 50MB per image; server will compress smaller files.");
  //       if (e.target) e.target.value = "";
  //       return;
  //     }
  //     validNew.push(f);
  //   }
  //   const newPreviews = validNew.map((f) => URL.createObjectURL(f));
  //   setImageFiles((prev) => [...prev, ...validNew].slice(0, MAX_POST_IMAGES));
  //   setImagePreviews((prev) => {
  //     const merged = [...prev, ...newPreviews].slice(0, MAX_POST_IMAGES);
  //     const usedCount = merged.length - prev.length;
  //     newPreviews.slice(usedCount).forEach((p) => URL.revokeObjectURL(p));
  //     return merged;
  //   });
  //   if (e.target) e.target.value = "";
  // }

  // function removeImage(index: number) {
  //   setImageFiles((prev) => prev.filter((_, i) => i !== index));
  //   setImagePreviews((prev) => {
  //     URL.revokeObjectURL(prev[index]!);
  //     return prev.filter((_, i) => i !== index);
  //   });
  //   setImageError(null);
  // }

  // async function handlePost(e: React.FormEvent) {
  //   e.preventDefault();
  //   if (!content.trim() || submitting) return;
  //   setSubmitting(true);
  //   setImageError(null);
  //   try {
  //     let imageUrls: string[] = [];
  //     if (imageFiles.length > 0) {
  //       const form = new FormData();
  //       imageFiles.forEach((f) => form.append("file", f));
  //       const up = await fetch("/api/upload", { method: "POST", body: form });
  //       const upData = await up.json().catch(() => ({})) as { url?: string; urls?: string[]; error?: string };
  //       if (!up.ok) {
  //         setImageError(upData.error ?? "Upload failed.");
  //         setSubmitting(false);
  //         return;
  //       }
  //       imageUrls = Array.isArray(upData.urls) ? upData.urls : upData.url ? [upData.url] : [];
  //     }
  //     const res = await fetch("/api/community/posts", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ content: content.trim(), imageUrls: imageUrls.length ? imageUrls : undefined }),
  //     });
  //     if (res.ok) {
  //       setContent("");
  //       setImageFiles([]);
  //       imagePreviews.forEach((p) => URL.revokeObjectURL(p));
  //       setImagePreviews([]);
  //       if (fileInputRef.current) fileInputRef.current.value = "";
  //       await fetchPosts(viewMode === "mine");
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }

  // async function handleLike(postId: string) {
  //   if (!session?.user) return;
  //   try {
  //     const res = await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
  //     if (res.ok) {
  //       const data = (await res.json()) as { post: PostType };
  //       setPosts((prev) => prev.map((p) => (p.id === postId ? data.post : p)));
  //     }
  //   } catch {}
  // }

  // async function handleComment(postId: string) {
  //   const text = commentByPost[postId]?.trim();
  //   if (!text || !session?.user || submittingComment) return;
  //   setSubmittingComment(postId);
  //   try {
  //     const res = await fetch(`/api/community/posts/${postId}/comments`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ content: text }),
  //     });
  //     if (res.ok) {
  //       setCommentByPost((prev) => ({ ...prev, [postId]: "" }));
  //       await fetchPosts(viewMode === "mine");
  //     }
  //   } finally {
  //     setSubmittingComment(null);
  //   }
  // }

  // const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <div className="community-feed">
      {/* {isLoggedIn && (
        <form onSubmit={handlePost} className="community-composer card">
          <div className="community-composer-row">
            <span className="community-avatar community-avatar-sm" aria-hidden="true">
              {profile?.imageUrl ? (
                <Image src={profile.imageUrl} alt="" width={40} height={40} className="community-avatar-img" unoptimized />
              ) : (
                getInitials(session?.user?.name, session?.user?.email)
              )}
            </span>
            <div className="community-composer-fields">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="community-composer-input"
                rows={2}
                maxLength={2000}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="community-composer-file-input"
                aria-label="Add images"
              />
              <div className="community-composer-images-row">
                <button
                  type="button"
                  className="community-composer-add-photos"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageFiles.length >= MAX_POST_IMAGES}
                >
                  <span className="community-composer-add-icon" aria-hidden>+</span>
                  Photos ({imageFiles.length}/{MAX_POST_IMAGES})
                </button>
                {imagePreviews.length > 0 && (
                  <div className="community-composer-previews">
                    {imagePreviews.map((src, i) => (
                      <div key={src} className="community-composer-preview-wrap">
                        <img src={src} alt="" className="community-composer-preview-img" />
                        <button
                          type="button"
                          className="community-composer-preview-remove"
                          onClick={() => removeImage(i)}
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {imageError && <p className="community-composer-image-error" role="alert">{imageError}</p>}
              <div className="community-composer-actions">
                <button type="submit" className="btn btn-primary btn-sm" disabled={!content.trim() || submitting}>
                  {submitting ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {!isLoggedIn && (
        <div className="community-gate card">
          <p className="community-gate-text">Sign in to post, like, and comment—connect with others on the journey.</p>
          <Link href="/login?callbackUrl=/community" className="btn btn-primary">
            Sign in to join
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <div className="community-feed-tabs" role="tablist" aria-label="Feed view">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "all"}
            className={`community-feed-tab ${viewMode === "all" ? "community-feed-tab-active" : ""}`}
            onClick={() => switchView("all")}
          >
            Feed
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "following"}
            className={`community-feed-tab ${viewMode === "following" ? "community-feed-tab-active" : ""}`}
            onClick={() => switchView("following")}
          >
            Following
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "mine"}
            className={`community-feed-tab ${viewMode === "mine" ? "community-feed-tab-active" : ""}`}
            onClick={() => switchView("mine")}
          >
            My posts
          </button>
        </div>
      )}

      <h2 className="community-feed-heading">
        {viewMode === "mine" ? "My posts" : viewMode === "following" ? "Following" : "Feed"}
      </h2>
      {loading ? (
        <p className="muted">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="card community-empty">
          <p className="muted" style={{ margin: 0 }}>
            {viewMode === "mine"
              ? (isLoggedIn ? "You haven't posted yet. Share something above!" : "Sign in to see your posts.")
              : viewMode === "following"
                ? (isLoggedIn ? "Follow people to see their posts here. Use the Feed tab to discover and follow." : "Sign in to see posts from people you follow.")
                : (isLoggedIn ? "No posts yet. Be the first to share something." : "No posts yet. Sign in to post.")}
          </p>
        </div>
      ) : (
        <ul className="community-feed-list">
          {posts.map((post) => {
            const liked = session?.user?.id ? post.likeIds.includes(session.user.id) : false;
            return (
              <li key={post.id} className="community-post card">
                <div className="community-post-header">
                  <Link href={`/people/${encodeURIComponent(post.userId)}`} className="community-post-author-link">
                    <span className="community-avatar" aria-hidden="true">
                      {post.userId === session?.user?.id && profile?.imageUrl ? (
                        <Image src={profile.imageUrl} alt="" width={44} height={44} className="community-avatar-img" unoptimized />
                      ) : (
                        getInitials(post.userName, post.userEmail)
                      )}
                    </span>
                    <div className="community-post-meta">
                      <span className="community-post-author">
                        {post.userId === session?.user?.id && profile?.displayName ? profile.displayName : post.userName}
                      </span>
                      <span className="community-post-time">{formatTime(post.createdAt)}</span>
                    </div>
                  </Link>
                  {isLoggedIn && post.userId !== session?.user?.id && (
                    <button
                      type="button"
                      className={`community-follow-btn ${followingIds.has(post.userId) ? "community-follow-btn-active" : ""}`}
                      onClick={() => handleFollowToggle(post.userId)}
                      disabled={followLoading === post.userId}
                      aria-pressed={followingIds.has(post.userId)}
                    >
                      {followLoading === post.userId ? "…" : followingIds.has(post.userId) ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <p className="community-post-content">{post.content}</p>
                {(() => {
                  const urls = post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [];
                  if (urls.length === 0) return null;
                  return (
                    <div className={`community-post-images community-post-images-count-${Math.min(urls.length, 5)}`}>
                      {urls.map((url, i) => (
                        <div key={i} className="community-post-image-wrap">
                          <Image
                            src={url}
                            alt=""
                            width={600}
                            height={400}
                            sizes="(max-width: 640px) 100vw, 280px"
                            unoptimized
                            className="community-post-image"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
                <div className="community-post-actions">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`community-action-btn ${liked ? "community-action-btn-liked" : ""}`}
                    disabled={!isLoggedIn}
                    title={liked ? "Unlike" : "Like"}
                    aria-pressed={liked}
                  >
                    <HeartIcon filled={liked} />
                    <span>{post.likeIds.length}</span>
                  </button>
                  <span className="community-action-btn community-action-btn-static">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{post.comments.length}</span>
                  </span>
                </div>
                {post.comments.length > 0 && (
                  <ul className="community-comments">
                    {post.comments.map((c) => (
                      <li key={c.id} className="community-comment">
                        <strong className="community-comment-author">
                        {c.userId === session?.user?.id && profile?.displayName ? profile.displayName : c.userName}
                      </strong>
                        <span className="community-comment-content">{c.content}</span>
                        <span className="community-comment-time">{formatTime(c.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {isLoggedIn && (
                  <div className="community-comment-form">
                    <input
                      type="text"
                      value={commentByPost[post.id] ?? ""}
                      onChange={(e) => setCommentByPost((prev) => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a comment…"
                      className="community-comment-input"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleComment(post.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleComment(post.id)}
                      className="btn btn-secondary btn-sm"
                      disabled={!commentByPost[post.id]?.trim() || submittingComment === post.id}
                    >
                      {submittingComment === post.id ? "…" : "Comment"}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )} */}
    </div>
  );
}
