"use client";

import { Button } from "@/components/shadcn-ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn-ui/sheet";
import { LogIn, Menu, ShoppingCart, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

export default function MobileNavbarMenu({
  categories,
}: {
  categories: Category[];
}) {
  const { data: session, status } = useSession();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5 text-primary" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="overflow-y-auto z-70 p-0 bg-white border-r border-pink-100 min-w-[220px] max-w-xs"
      >
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle>
            <SheetClose asChild>
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-lg text-primary">ShopTal</span>
              </Link>
            </SheetClose>
          </SheetTitle>
          <SheetDescription className="text-left text-xs text-gray-500">
            Main Menu
          </SheetDescription>
        </SheetHeader>
        <SheetClose asChild>
          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="rounded hover:bg-pink-50 transition-colors flex mt-2 font-medium text-sm px-4 py-2"
              aria-label="User Account"
            >
              <LogIn className="h-5 w-5" />
              <span className="ml-2">Login</span>
            </Link>
          )}
        </SheetClose>
        <SheetClose asChild>
          <Link
            href="/profile"
            className="rounded hover:bg-pink-50 transition-colors flex mt-2 font-medium text-sm px-4 py-2"
            aria-label="User Account"
          >
            <User className="h-5 w-5" />
            <span className="ml-2">Profile</span>
          </Link>
        </SheetClose>
        <SheetClose asChild>
          <Link
            href={"/cart"}
            className="rounded hover:bg-pink-50 transition-colors flex mt-2 font-medium text-sm px-4 py-2"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="ml-2">Cart</span>
          </Link>
        </SheetClose>
        <SheetDescription className="text-left mt-3 px-4 text-xs text-gray-500">
          Browse Categories
        </SheetDescription>
        <Accordion type="single" collapsible className="w-full px-2">
          {categories.map((category: Category) => (
            <AccordionItem
              key={category.id}
              value={`category-${category.id}`}
              className="border-b border-pink-50"
            >
              <AccordionTrigger className="text-sm font-semibold text-primary hover:text-pink-600 px-2 py-2">
                <SheetClose asChild>
                  <Link
                    href={`/search?categoryId=${category.id}`}
                    className="w-full text-left"
                  >
                    {category.name}
                  </Link>
                </SheetClose>
              </AccordionTrigger>
              <AccordionContent className="pl-4 pb-2">
                <Accordion type="multiple" defaultValue={[]}>
                  {category.productSubcategory.length > 0 && (
                    <AccordionItem
                      value="subcategories"
                      className="border-none"
                    >
                      <AccordionTrigger className="ml-2 text-xs font-medium text-gray-700 hover:text-pink-600 px-0 py-1">
                        Subcategories
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {category.productSubcategory.map((subcategory) => (
                            <li key={subcategory.id}>
                              <SheetClose asChild>
                                <Link
                                  href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                                  className="block px-3 py-1 hover:bg-pink-50 rounded text-xs"
                                >
                                  {subcategory.name}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {category.brands.length > 0 && (
                    <AccordionItem value="brands" className="border-none">
                      <AccordionTrigger className="ml-2 text-xs font-medium text-gray-700 hover:text-pink-600 px-0 py-1">
                        Brands
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {category.brands.map((brandItem) => (
                            <li key={brandItem.brand.id}>
                              <SheetClose asChild>
                                <Link
                                  href={`/search?categoryId=${brandItem.categoryId}&brandId=${brandItem.brand.id}`}
                                  className="block px-3 py-1 hover:bg-pink-50 rounded text-xs"
                                >
                                  {brandItem.brand.name}
                                </Link>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
