import LocalSwitcher from "@/components/shared/locale-switcher";
import ProfileInfo from "@/components/shared/profile-info";
import ThemeButton from "@/components/shared/theme-switcher";
import { User } from "@prisma/client";

interface DashboardHeaderProps {
  user: Pick<User, "name" | "picture" | "email">;
  children: React.ReactNode;
}

export function DashboardHeader({ user, children }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        {children}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <div className="flex justify-end items-center gap-2 w-full ">
              <ProfileInfo
                user={{
                  name: user?.name,
                  picture: user?.picture as string,
                  email: user?.email,
                }}
              />
              <LocalSwitcher />
              <ThemeButton />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
