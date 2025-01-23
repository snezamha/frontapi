"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/shared/icon";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

import { UserAvatar } from "./user-avatar";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "picture" | "email">;
}
const ProfileInfo = ({ user }: NavbarProps) => {
  const t = useTranslations("profileInfo");
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="flex items-center gap-3 text-default-800 ">
            <UserAvatar
              user={{
                name: user.name || null,
                picture: user.picture || null,
              }}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-0" align="end">
          <DropdownMenuLabel className="flex gap-2 items-center mb-1 p-3">
            <UserAvatar
              user={{
                name: user.name || null,
                picture: user.picture || null,
              }}
            />

            <div>
              <div className="text-sm font-medium text-default-800 capitalize">
                {user.name || null}
              </div>
              <span className="text-xs text-default-600 hover:text-primary">
                {user.email || null}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {[
              {
                name: t("home"),
                icon: "heroicons:home",
                href: "/",
              },
              {
                name: t("dashboard"),
                icon: "heroicons:tv",
                href: "/dashboard",
              },
            ].map((item, index) => (
              <Link
                href={item.href}
                key={`info-menu-${index}`}
                className="cursor-pointer"
              >
                <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer">
                  <Icon icon={item.icon} className="w-4 h-4" />
                  {item.name}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              signOut({
                callbackUrl: `${window.location.origin}`,
              });
            }}
          >
            <Icon icon="heroicons:power" className="w-4 h-4" />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
export default ProfileInfo;
