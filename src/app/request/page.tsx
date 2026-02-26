import type { Metadata } from "next";
import InquiryForm from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Journey inquiry | Return to Roots",
  description:
    "Submit your interest for a cultural immersion journey. We'll guide you through dates, preferences, and next steps.",
};

type PageProps = { searchParams: Promise<{ journey?: string; type?: string }> };

export default async function RequestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const inquiryType = params?.type === "residency" ? "residency" : "journey";
  return <InquiryForm defaultJourney={params?.journey} inquiryType={inquiryType} />;
}
