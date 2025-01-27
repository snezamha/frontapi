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
          variant="ghost"
          size="icon"
          className={cn(
            "size-5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
            className,
          )}
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
            <Button
              className="flex justify-center items-center"
              variant="link"
              asChild
            >
              <Link href="/" className="flex items-center gap-2">
                <Logo className="text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" />
                <SheetTitle className="font-bold text-lg">
                  {t("title")}
                </SheetTitle>
              </Link>
            </Button>
          </SheetHeader>
        </SheetClose>
        {children}
      </SheetContent>
    </Sheet>
  );
}
