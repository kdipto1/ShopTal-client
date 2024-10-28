"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/shadcn-ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export function NavigationMenuDemo() {
  const [data, setData] = React.useState([]);
  const fetchNavbarCategory = async () => {
    const response = await fetch(
      "http://localhost:5000/api/v1/categories/navbar-category"
    );
    const data = await response.json();
    setData(data.data);
  };

  React.useEffect(() => {
    fetchNavbarCategory();
  }, []);

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {data?.map((category: any) => (
          <NavigationMenuItem key={category?.id}>
            <NavigationMenuTrigger>{category?.name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              {category?.productSubcategory?.length > 0 ? (
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {category?.productSubcategory?.map((subcategory: any) => (
                    <ListItem
                      key={subcategory?.id}
                      title={subcategory?.name}
                      // href={component.href}
                    >
                      {/* {component.description} */}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                ""
              )}
              {category?.brands?.length > 0 ? (
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {category?.brands?.map((brand: any) => (
                    <ListItem
                      key={brand?.id}
                      title={brand?.name}
                      // href={component.href}
                    >
                      {/* {component.description} */}
                    </ListItem>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
