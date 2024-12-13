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
// import { useNavigation } from "@/hooks/useNavigation";
import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  categoryId?: string;
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
  // const { categories, isLoading, error } = useNavigation();

  // if (isLoading) {
  //   return <div className="flex justify-center p-4">Loading navigation...</div>;
  // }

  // if (error) {
  //   return (
  //     <div className="flex justify-center p-4 text-red-500">
  //       Error loading navigation
  //     </div>
  //   );
  // }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto z-[70]">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-2xl">ShopTal</span>
            </Link>
          </SheetTitle>
          <SheetDescription className="text-left">Main Menu</SheetDescription>
        </SheetHeader>
        <Link
          href="/profile"
          className="rounded-md hover:bg-gray-100 transition-colors flex mt-4 font-semibold"
          aria-label="User Account"
        >
          <LogIn className="h-5 w-5" /> &nbsp; Login
        </Link>
        <Link
          href="/profile"
          className="rounded-md hover:bg-gray-100 transition-colors flex mt-4 font-semibold"
          aria-label="User Account"
        >
          <User className="h-5 w-5" /> &nbsp; Profile
        </Link>
        <Link
          href={"/cart"}
          className="rounded-md hover:bg-gray-100 transition-colors flex mt-4 font-semibold"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="h-5 w-5" /> &nbsp; Cart
        </Link>

        <SheetDescription className="text-left mt-4">
          Browse Categories
        </SheetDescription>
        <Accordion type="single" collapsible className="w-full">
          {/* {isLoading && <p>Categories Loading...</p>} */}
          {/* {error && <p>Failed to lead categories. Try again...</p>} */}
          {categories.map((category: Category) => (
            <AccordionItem key={category.id} value={`category-${category.id}`}>
              <AccordionTrigger>
                <Link
                  href={`/search?categoryId=${category.id}`}
                  className="w-full text-left hover:underline"
                >
                  {category.name}
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                <Accordion
                  type="multiple"
                  defaultValue={["subcategories", "brands"]}
                >
                  {/* Subcategories Section */}
                  {category.productSubcategory.length > 0 && (
                    <AccordionItem value="subcategories">
                      <AccordionTrigger className="ml-2">
                        Subcategories
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {category.productSubcategory.map((subcategory) => (
                            <li key={subcategory.id}>
                              <SheetClose asChild>
                                <Link
                                  href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                                  className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded"
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

                  {/* Brands Section */}
                  {category.brands.length > 0 && (
                    <AccordionItem value="brands">
                      <AccordionTrigger className="ml-2">
                        Brands
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {category.brands.map((brand) => (
                            <li key={brand.id}>
                              <SheetClose asChild>
                                <Link
                                  href={`/search?categoryId=${brand.categoryId}&brandId=${brand.id}`}
                                  className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded"
                                >
                                  {brand.name}
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
