import DashboardPanelLayout from "@/components/layout/dashboard";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardPanelLayout>{children}</DashboardPanelLayout>;
}
