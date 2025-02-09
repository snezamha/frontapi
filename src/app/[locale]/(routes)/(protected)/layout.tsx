'use client';

import React from 'react';
import { DashboardNavbar } from '@/components/dashboard/navbar';
import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardNavbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto mx-auto p-4 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
