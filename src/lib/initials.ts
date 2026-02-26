export function getInitials(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    const local = email.split("@")[0];
    return (local?.slice(0, 2) ?? "?").toUpperCase();
  }
  return "?";
}
