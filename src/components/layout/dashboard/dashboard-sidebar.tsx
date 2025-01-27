"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/logo";
import { Menu } from "./menu";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function DashboardSidebar({
  children,
  className,
  ...props
}: DashboardSidebarProps) {
  const t = useTranslations("rootLayout");

  return (
    <aside
      aria-label="Dashboard Sidebar"
      className={cn("flex h-screen w-full flex-col", className)}
      {...props}
    >
      <header className="hidden h-[3.55rem] items-center gap-4 border-b border-border/60 px-4 py-2 lg:flex lg:px-6">
        <Button variant="link" asChild>
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
            <h1 className="text-xl font-semibold text-default-900">
              {t("title")}
            </h1>
          </Link>
        </Button>
      </header>
      <div className="flex flex-col gap-2.5 px-4 pt-2 lg:px-6 lg:pt-4">
        {children}
      </div>
      <Menu />
    </aside>
  );
}
