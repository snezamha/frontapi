import { Link } from "@/i18n/routing";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "./menu";
import { useLocale, useTranslations } from "next-intl";
import Logo from "@/components/shared/logo";

export function SheetMenu() {
  const locale = useLocale();
  const t = useTranslations("rootLayout");

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:w-72 px-3 h-full flex flex-col"
        side={locale === "fa" ? "right" : "left"}
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="text-default-900 h-8 w-8 [&>path:nth-child(3)]:text-background [&>path:nth-child(2)]:text-background" />
              <SheetTitle className="font-bold text-lg">
                {t("title")}
              </SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu />
      </SheetContent>
    </Sheet>
  );
}
