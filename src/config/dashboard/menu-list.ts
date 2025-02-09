type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: string;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(
  pathname: string,
  t: (key: string) => string
): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/',
          label: t('homePage'),
          active: pathname === '/',
          icon: 'iconoir:home',
        },
        {
          href: '/dashboard',
          label: t('dashboard'),
          icon: 'stash:dashboard',
        },
      ],
    },
  ];
}
