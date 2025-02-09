'use client';

import { Link } from '@/i18n/routing';
import { useState } from 'react';
import { ChevronDown, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/shared/icon';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

interface CollapseMenuButtonProps {
  icon: string;
  label: string;
  active: boolean;
  submenus: Submenu[];
}

export function CollapseMenuButton({
  icon,
  label,
  submenus,
}: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const isSubmenuActive = submenus.some((submenu) =>
    submenu.active === undefined ? submenu.href === pathname : submenu.active
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Button
          variant={isSubmenuActive ? 'secondary' : 'ghost'}
          className="justify-start w-full h-10"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="me-6">
                <Icon icon={icon} />
              </span>
              <p className="max-w-[150px] truncate">{label}</p>
            </div>
            <div className="whitespace-nowrap">
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            variant={
              (active === undefined && pathname === href) || active
                ? 'secondary'
                : 'ghost'
            }
            className="justify-start w-full h-10 mb-1"
            asChild
          >
            <Link href={href}>
              <span className="ml-2 mr-4">
                <Dot size={18} />
              </span>
              <p className="max-w-[170px] truncate">{label}</p>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
