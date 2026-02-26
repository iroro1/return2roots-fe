import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CpanelSidebar } from "@/components/cpanel-sidebar";

export default async function CPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/cpanel");
  }
  return (
    <div className="shell cpanel-wrap">
      <div className="cpanel-layout">
        <CpanelSidebar />
        <section className="cpanel-main">{children}</section>
      </div>
    </div>
  );
}
