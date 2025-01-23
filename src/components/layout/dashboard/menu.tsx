"use client";

import { Link } from "@/i18n/routing";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLangDir } from "rtl-detect";
import { cn } from "@/lib/utils";
import { getMenuList } from "@/config/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "./collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Icon } from "@/components/shared/icon";

export function Menu() {
  const t = useTranslations("dashboardMenu");
  const pathname = usePathname();
  const menuList = getMenuList(pathname, t);
  const params = useParams<{ locale: string }>();
  const direction = getLangDir(params?.locale ?? "");

  return (
    <ScrollArea className="[&>div>div[style]]:!block" dir={direction}>
      <nav className="mt-6 h-full w-full">
        <ul className="h-full flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-4">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {groupLabel ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : groupLabel ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(({ href, label, icon, active, submenus }, index) =>
                !submenus || submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              (active === undefined &&
                                pathname.startsWith(href)) ||
                              active
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start h-10 mb-1"
                            asChild
                          >
                            <Link href={href}>
                              <span className="me-4">
                                <Icon icon={icon} />
                              </span>
                              <p className="max-w-[200px] truncate">{label}</p>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    <CollapseMenuButton
                      icon={icon}
                      label={label}
                      active={
                        active === undefined
                          ? pathname.startsWith(href)
                          : active
                      }
                      submenus={submenus}
                    />
                  </div>
                ),
              )}
            </li>
          ))}
          <li className="w-full">
            <Button
              onClick={() => {
                signOut({
                  callbackUrl: `${window.location.origin}`,
                });
              }}
              variant="outline"
              className="w-full justify-center h-10 mt-5"
            >
              <span className="me-4">
                <Icon icon="heroicons:power" />
              </span>
              <p className="whitespace-nowrap">{t("logout")}</p>
            </Button>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
