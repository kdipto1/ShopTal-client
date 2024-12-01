import {
  LayoutGrid,
  Users,
  LucideTag,
  LucideTags,
  ShoppingBag,
  Award,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Main",
      menus: [
        {
          href: "/dashboard/products",
          label: "Products",
          active: pathname.includes("/dashboard/products"),
          icon: ShoppingBag,
          submenus: [
            // {
            //   href: "/dashboard/products/new",
            //   label: "New Product",
            //   active: pathname === "/dashboard/products/new",
            // },
          ],
        },
        {
          href: "/dashboard/brands",
          label: "Brands",
          active: pathname.includes("/dashboard/brands"),
          icon: Award,
          submenus: [],
        },
        {
          href: "/dashboard/categories",
          label: "Categories",
          active: pathname.includes("/dashboard/categories"),
          icon: LucideTag,
          submenus: [],
        },
        {
          href: "/dashboard/subcategories",
          label: "Subcategories",
          active: pathname.includes("/dashboard/subcategories"),
          icon: LucideTags,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashboard/users",
          label: "Users",
          active: pathname.includes("/dashboard/users"),
          icon: Users,
          submenus: [],
        },
        // {
        //   href: "/dashboard/account",
        //   label: "Account",
        //   active: pathname.includes("/dashboard/account"),
        //   icon: Settings,
        //   submenus: [],
        // },
      ],
    },
  ];
}
