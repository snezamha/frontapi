import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { Menu } from './menu';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: SidebarProps) {
  const locale = useLocale();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={cn(
          'fixed inset-y-0 z-50 w-64 pt-2 ltr:border-r rtl:border-l bg-white dark:bg-gray-900 overflow-y-auto transition duration-300 ease-in-out transform',
          locale === 'fa'
            ? open
              ? 'right-0 translate-x-0'
              : 'right-0 translate-x-full'
            : open
              ? 'left-0 translate-x-0'
              : 'left-0 -translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-0'
        )}
      >
        <Menu onClose={onClose} />
      </div>
    </>
  );
}
