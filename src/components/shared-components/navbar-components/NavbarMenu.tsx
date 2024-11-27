"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { useNavigation } from "@/hooks/useNavigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/shadcn-ui/navigation-menu";

interface Brand {
  id: string;
  name: string;
}

interface ProductSubcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

export default function ResponsiveMenu() {
  const { categories, isLoading, error } = useNavigation();

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading navigation...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-4 text-red-500">
        Error loading navigation
      </div>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
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
  );
}

const SubcategoryList = ({ category }: { category: Category }) => {
  return (
    <ul className="grid gap-3 p-4 md:w-[200px] md:grid-cols-1 lg:w-[300px] lg:grid-cols-2 ">
      {category.productSubcategory.map((subcategory) => (
        <Link
          key={subcategory.id}
          href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
        >
          <ListItem title={subcategory.name} />
        </Link>
      ))}
      {category.brands.length > 0 && (
        <NavigationMenuItem>
          <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
              {category.brands.map((brand) => (
                <Link key={brand.id} href={`/search?brandId=${brand.id}`}>
                  <ListItem title={brand.name} />
                </Link>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      )}
    </ul>
  );
};

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
