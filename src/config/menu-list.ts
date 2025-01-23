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
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: t("home"),
          active: pathname === "/",
          icon: "heroicons:home",
        },
        {
          href: "/dashboard",
          label: t("dashboard"),
          active: pathname === "/dashboard",
          icon: "heroicons:tv",
        },
        {
          href: "/dashboard/profile",
          label: t("profile"),
          active: pathname === "/dashboard/profile",
          icon: "heroicons:user",
        },
        {
          href: "",
          label: t("projects"),
          icon: "heroicons:puzzle-piece",
          submenus: [
            {
              href: "/dashboard/projects/add",
              label: t("addProject"),
              active: pathname === "/dashboard/projects/add",
            },
            {
              href: "/dashboard/projects",
              label: t("listOfProjects"),
              active:
                pathname === "/dashboard/projects" ||
                /^\/dashboard\/projects\/[a-fA-F0-9]{24}$/.test(pathname) ||
                /^\/dashboard\/projects\/[a-fA-F0-9]{24}(\/settings)?$/.test(
                  pathname,
                ),
            },
          ],
        },
      ],
    },
  ];
}
