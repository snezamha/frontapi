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
  const projectPathMatch = pathname.match(/^\/[a-fA-F0-9]{24}/);
  const projectBasePath = projectPathMatch ? projectPathMatch[0] : "";
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
          active: new RegExp(
            `^/projects($|/add$|/[a-fA-F0-9]{24}(/settings)?$)`,
          ).test(pathname),
        },
      ],
    },
    ...(isProject
      ? [
          {
            groupLabel: "",
            menus: [
              {
                href: `${projectBasePath}/dashboard`,
                label: t("dashboard"),
                active: /^\/[a-fA-F0-9]{24}(\/dashboard)?$/.test(pathname),
                icon: "heroicons:tv",
              },
            ],
          },
          {
            groupLabel: t("modules"),
            menus: [
              {
                href: `${projectBasePath}/classifications`,
                label: t("categories"),
                icon: "heroicons:list-bullet-20-solid",
                active: new RegExp(
                  `^${projectBasePath}/classifications($|/.*)`,
                ).test(pathname),
              },
              {
                href: `${projectBasePath}/users`,
                label: t("users"),
                icon: "heroicons:users",
                active: new RegExp(`^${projectBasePath}/users($|/.*)`).test(
                  pathname,
                ),
              },
              {
                href: `${projectBasePath}/stores`,
                label: t("stores"),
                icon: "heroicons:shopping-cart",
                active: new RegExp(`^${projectBasePath}/stores($|/.*)`).test(
                  pathname,
                ),
              },
            ],
          },
        ]
      : []),
  ];
}
