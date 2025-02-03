"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebar } from "@/providers/sidebar-provider";
import { MenuIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Logo from "@/components/shared/logo";

export interface DashboardSidebarSheetProps
  extends React.ComponentPropsWithRef<typeof SheetTrigger>,
    ButtonProps {}

export function DashboardSidebarSheet({
  children,
  className,
  ...props
}: DashboardSidebarSheetProps) {
  const { open, setOpen } = useSidebar();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const locale = useLocale();
  const t = useTranslations("rootLayout");

  if (isDesktop) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("", className)}
          {...props}
        >
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={locale === "fa" ? "right" : "left"}
        className="inset-y-0 flex h-auto w-[18.75rem] flex-col items-center gap-4 px-0 py-4"
      >
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>
        <SheetClose asChild>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <Link href="/" className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Logo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
              </Button>
              <h1 className="text-xl font-semibold text-default-900">
                {t("title")}
              </h1>
            </Link>
          </SheetHeader>
        </SheetClose>
        {children}
      </SheetContent>
    </Sheet>
  );
}
