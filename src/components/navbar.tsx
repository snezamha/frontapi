import Link from 'next/link';
import ThemeButton from '@/components/shared/theme-switcher';
import { Button } from '@/components/ui/button';
import Logo from './header/logo';
import LocalSwitcher from './shared/locale-switcher';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex items-center px-6 h-14">
        <div className="flex-1">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Logo className="h-8 w-8 text-default-900 [&>path:nth-child(2)]:text-background [&>path:nth-child(3)]:text-background" />
            </Button>
            <h1 className="hidden text-xl font-semibold lg:block text-default-900">
              FrontAPI
            </h1>
          </Link>
        </div>

        <div className="flex flex-1 justify-end space-x-2 rtl:space-x-reverse">
          <LocalSwitcher />
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
