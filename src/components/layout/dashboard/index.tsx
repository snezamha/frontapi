"use client";

import Footer from "../footer";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-svh w-full flex-col bg-default-100 dark:bg-background">
        <Navbar />
        <Sidebar />
        <main className="flex-1 xl:ms-[248px] bg-default-100 dark:bg-background">
          <div className="mb-24 md:mb-0 p-6">{children}</div>
        </main>
        <Footer />
      </div>
      <Sidebar />
    </>
  );
}
