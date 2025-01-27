import DashboardPanelLayout from "@/components/layout/dashboard";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/auth");
  }
  return <DashboardPanelLayout>{children}</DashboardPanelLayout>;
}
