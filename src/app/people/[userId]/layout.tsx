import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Return to Roots",
  description: "View community member profile and posts.",
};

export default function PeopleProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
