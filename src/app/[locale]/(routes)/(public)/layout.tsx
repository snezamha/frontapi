import LocalSwitcher from "@/components/shared/locale-switcher";
import Footer from "@/components/layout/footer";
import { currentUser } from "@/lib/auth";
import ProfileInfo from "@/components/shared/profile-info";
import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import Logo from "@/components/shared/logo";
import { getTranslations } from "next-intl/server";
import ThemeButton from "@/components/shared/theme-switcher";

const RoutesLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const user = await currentUser();
  const t = await getTranslations("rootLayout");

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-14 items-center px-6">
          <Link href="/" className="flex gap-2 items-center">
            <Button variant="outline" size="icon">
              <Logo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
            </Button>
            <h1 className="lg:block hidden text-xl font-semibold text-default-900">
              {t("title")}
            </h1>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-2">
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
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default RoutesLayout;
