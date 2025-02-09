'use client';
import { Ellipsis } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getMenuList } from '@/config/dashboard/menu-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollapseMenuButton } from './collapse-menu-button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useLocale, useTranslations } from 'next-intl';
import { Icon } from '@/components/shared/icon';
import { Link } from '@/i18n/routing';

interface MenuProps {
  onClose: () => void;
}

export function Menu({ onClose }: MenuProps) {
  const t = useTranslations('dashboardMenu');
  const pathname = usePathname();
  const menuList = getMenuList(pathname, t);
  const locale = useLocale();

  return (
    <ScrollArea
      className="h-[calc(100vh-8rem)] px-2"
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
    >
      <nav className="flex flex-col w-full">
        <ul className="items-start px-4 space-y-1">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {groupLabel ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 truncate">
                  {groupLabel}
                </p>
              ) : groupLabel ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="w-full">
                      <div className="flex items-center justify-center w-full">
                        <Ellipsis className="w-5 h-5" />
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
                                ? 'secondary'
                                : 'ghost'
                            }
                            className="justify-start w-full h-10 mb-1"
                            asChild
                          >
                            <Link href={href} onClick={onClose}>
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
                )
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
