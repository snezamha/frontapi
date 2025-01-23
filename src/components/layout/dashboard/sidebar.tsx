"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Menu } from "./menu";
import { useTranslations } from "next-intl";
import Logo from "@/components/shared/logo";

export function Sidebar() {
  const t = useTranslations("rootLayout");

  return (
    <aside className={cn("fixed z-50 w-[254px] xl:block hidden")}>
      <div className="relative h-screen flex flex-col px-3 py-4">
        <Button variant="link" asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" />
            <h1 className="text-xl font-semibold text-default-900">
              {t("title")}
            </h1>
          </Link>
        </Button>
        <Menu />
      </div>
    </aside>
  );
}
