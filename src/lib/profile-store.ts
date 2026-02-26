/**
 * In-memory store for extended profile (display name, origin, interests, language, image).
 * Replace with DB for production.
 */

export type ProfileExtension = {
  userId: string;
  displayName?: string;
  origin?: string;
  interests?: string;
  language?: "en" | "fr";
  imageUrl?: string;
};

const byUserId = new Map<string, ProfileExtension>();

export function getProfile(userId: string): ProfileExtension | null {
  return byUserId.get(userId) ?? null;
}

export function updateProfile(userId: string, data: Partial<Omit<ProfileExtension, "userId">>): ProfileExtension {
  const existing = byUserId.get(userId);
  const next: ProfileExtension = {
    userId,
    displayName: data.displayName !== undefined ? data.displayName : existing?.displayName,
    origin: data.origin !== undefined ? data.origin : existing?.origin,
    interests: data.interests !== undefined ? data.interests : existing?.interests,
    language: data.language !== undefined ? data.language : existing?.language,
    imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing?.imageUrl,
  };
  byUserId.set(userId, next);
  return next;
}
