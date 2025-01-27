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
  t: (key: string) => string,
): Group[] {
  const isProject = /^\/[a-fA-F0-9]{24}\/.*$/.test(pathname);

  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/profile",
          label: t("profile"),
          active: pathname === "/profile",
          icon: "heroicons:user",
        },
        {
          href: "/projects",
          label: t("projects"),
          icon: "heroicons:puzzle-piece",
          active:
            pathname === "/projects" ||
            pathname === "/projects/add" ||
            /^\/projects\/[a-fA-F0-9]{24}$/.test(pathname) ||
            /^\/projects\/[a-fA-F0-9]{24}(\/settings)?$/.test(pathname),
        },
      ],
    },
    ...(isProject
      ? [
          {
            groupLabel: "",
            menus: [
              {
                href: pathname,
                label: t("dashboard"),
                active: /^\/[a-fA-F0-9]{24}(\/dashboard)?$/.test(pathname),
                icon: "heroicons:tv",
              },
            ],
          },
        ]
      : []),
  ];
}
