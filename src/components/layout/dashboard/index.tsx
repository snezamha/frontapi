import * as React from "react";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { DashboardSidebar } from "./dashboard-sidebar";
import ProjectSwitcher from "./project-switcher";
import { getAllProjects } from "@/actions/projects";
import { currentUser } from "@/lib/auth";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebarSheet } from "./dashboard-sidebar-sheet";

export default async function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getAllProjects();
  const user = await currentUser();

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[17.5rem_1fr]">
        <DashboardSidebar className="top-0 z-30 hidden flex-col gap-4 ltr:border-r rtl:border-l border-border/60 lg:sticky lg:block">
          <ProjectSwitcher items={projects} />
        </DashboardSidebar>
        <div className="flex flex-col">
          {user && (
            <DashboardHeader user={user}>
              <DashboardSidebarSheet>
                <DashboardSidebar>
                  <ProjectSwitcher items={projects} />
                </DashboardSidebar>
              </DashboardSidebarSheet>
            </DashboardHeader>
          )}
          <main className="flex-1 overflow-hidden px-6 pt-6 bg-slate-100 dark:bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
