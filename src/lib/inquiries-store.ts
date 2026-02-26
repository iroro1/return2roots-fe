/**
 * In-memory store for journey inquiries.
 * Replace with DB (e.g. Prisma + Postgres) for production.
 */

export type StoredInquiry = {
  id: string;
  name: string;
  email: string;
  journey?: string;
  message: string;
  preferredDates?: string;
  accommodationPreference?: string;
  inquiryType?: "journey" | "residency";
  userId?: string;
  createdAt: string; // ISO
};

const store: StoredInquiry[] = [];

function nanoid(): string {
  return `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function addInquiry(data: Omit<StoredInquiry, "id" | "createdAt">): StoredInquiry {
  const inquiry: StoredInquiry = {
    ...data,
    id: nanoid(),
    createdAt: new Date().toISOString(),
  };
  store.push(inquiry);
  return inquiry;
}

export function getInquiries(): StoredInquiry[] {
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getInquiriesByUser(userId: string): StoredInquiry[] {
  return getInquiries().filter((i) => i.userId === userId);
}
