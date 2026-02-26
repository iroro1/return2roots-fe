import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn | Return to Roots",
  description:
    "Cultural content and education: articles on heritage, language, daily life, and history—before you go.",
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
