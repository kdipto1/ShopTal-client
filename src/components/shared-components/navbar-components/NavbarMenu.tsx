"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/shadcn-ui/navigation-menu";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/shadcn-ui/separator";

interface Brand {
  brandId: string;
  categoryId: string;
  brand: {
    id: string;
    name: string;
  };
}

interface ProductSubcategory {
  id: string;
  name: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

export default function NavbarMenu({ categories }: { categories: Category[] }) {
  const router = usePathname();

  const shouldHide = router.includes("/dashboard");

  if (shouldHide) {
    return null;
  }

  return (
    <section className="hidden md:block w-full border-b bg-white/95 backdrop-blur relative z-50">
      <div className="flex min-h-14 items-center justify-center">
        <NavigationMenu className="max-w-screen-2xl">
          <NavigationMenuList className="flex flex-wrap gap-1">
            {categories?.map((category) => (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href={`/search?categoryId=${category.id}`}
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {category.name}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore all {category.name} products
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <SubcategoryList category={category} />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Separator />
    </section>
  );
}

const SubcategoryList = ({ category }: { category: Category }) => {
  return (
    <div>
      <ul className="grid gap-3 p-2 md:w-[200px] md:grid-cols-1 lg:w-[300px] lg:grid-cols-2  ">
        {category.productSubcategory.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
          >
            <ListItem title={subcategory.name} />
          </Link>
        ))}
      </ul>
      {category.brands.length > 0 && (
        <ul className="grid gap-3 p-2 md:w-[200px] md:grid-cols-1 lg:w-[300px] lg:grid-cols-2">
          {category.brands.map((brandItem) => (
            <Link
              key={brandItem.brand.id}
              href={`/search?categoryId=${brandItem.categoryId}&brandId=${brandItem.brand.id}`}
            >
              <ListItem title={brandItem.brand.name} />
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <span
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
        </span>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
