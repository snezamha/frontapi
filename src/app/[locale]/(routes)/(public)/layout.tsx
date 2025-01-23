import LocalSwitcher from "@/components/shared/locale-switcher";
import ThemeButton from "@/components/shared/theme-switcher";
import Footer from "@/components/layout/footer";
import { currentUser } from "@/lib/auth";
import ProfileInfo from "@/components/shared/profile-info";
import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

const RoutesLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const user = await currentUser();
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex justify-end items-center gap-2 w-full px-5 py-4">
        {session ? (
          <ProfileInfo
            user={{
              name: user?.name,
              picture: user?.picture as string,
              email: user?.email,
            }}
          />
        ) : (
          <Link href="/auth">
            <Button size="icon" variant="outline">
              <UserCircle className="h-5 w-5" />
            </Button>
          </Link>
        )}

        <LocalSwitcher />
        <ThemeButton />
      </div>
      <div className="flex justify-center items-center grow h-full overflow-hidden">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default RoutesLayout;
