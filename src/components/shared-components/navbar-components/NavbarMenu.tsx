// "use client";

// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/shadcn-ui/navigation-menu";
// import { Separator } from "@/components/shadcn-ui/separator";
// import { cn } from "@/lib/utils";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import * as React from "react";

// interface Brand {
//   brandId: string;
//   categoryId: string;
//   brand: {
//     id: string;
//     name: string;
//   };
// }

// interface ProductSubcategory {
//   id: string;
//   name: string;
//   categoryId?: string;
// }

// interface Category {
//   id: string;
//   name: string;
//   productSubcategory: ProductSubcategory[];
//   brands: Brand[];
// }

// export default function NavbarMenu({ categories }: { categories: Category[] }) {
//   const router = usePathname();

//   const shouldHide = router.includes("/dashboard");

//   if (shouldHide) {
//     return null;
//   }

//   return (
//     <section className="hidden md:block w-full border-b bg-white/95 backdrop-blur-sm relative z-50">
//       <div className="flex min-h-14 items-center justify-center">
//         <NavigationMenu className="max-w-(--breakpoint-2xl)">
//           <NavigationMenuList className="flex flex-wrap gap-1">
//             {categories?.map((category) => (
//               <NavigationMenuItem key={category.id} className="">
//                 <NavigationMenuTrigger className="">
//                   {category.name}
//                 </NavigationMenuTrigger>

//                 <NavigationMenuContent className="">
//                   <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
//                     <div className="row-span-3">
//                       <NavigationMenuLink asChild>
//                         <Link
//                           className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden focus:shadow-md"
//                           href={`/search?categoryId=${category.id}`}
//                         >
//                           <div className="mb-2 mt-4 text-lg font-medium">
//                             {category.name}
//                           </div>
//                           <p className="text-sm leading-tight text-muted-foreground">
//                             Explore all {category.name} products
//                           </p>
//                         </Link>
//                       </NavigationMenuLink>
//                     </div>
//                     <SubcategoryList category={category} />
//                   </div>
//                 </NavigationMenuContent>
//               </NavigationMenuItem>
//             ))}
//           </NavigationMenuList>
//         </NavigationMenu>
//       </div>
//       <Separator />
//     </section>
//   );
// }

// const SubcategoryList = ({ category }: { category: Category }) => {
//   return (
//     <>
//       <ul className="grid gap-3 p-2 md:w-[200px] md:grid-cols-1 lg:w-[300px] lg:grid-cols-2  ">
//         {category.productSubcategory.map((subcategory) => (
//           <Link
//             key={subcategory.id}
//             href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
//           >
//             <ListItem title={subcategory.name} />
//           </Link>
//         ))}
//       </ul>
//       {category.brands.length > 0 && (
//         <ul className="grid gap-3 p-2 md:w-[200px] md:grid-cols-1 lg:w-[300px] lg:grid-cols-2">
//           {category.brands.map((brandItem) => (
//             <Link
//               key={brandItem.brand.id}
//               href={`/search?categoryId=${brandItem.categoryId}&brandId=${brandItem.brand.id}`}
//             >
//               <ListItem title={brandItem.brand.name} />
//             </Link>
//           ))}
//         </ul>
//       )}
//     </>
//   );
// };

// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <span
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </span>
//       </NavigationMenuLink>
//     </li>
//   );
// });
// ListItem.displayName = "ListItem";

/****---------------- */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ChevronDown } from "lucide-react";

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
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  );
  const [dropdownStyles, setDropdownStyles] =
    React.useState<React.CSSProperties>({});

  const shouldHide = router.includes("/dashboard");
  if (shouldHide) return null;

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleCategoryHover = (categoryId: string, index: number) => {
    const screenWidth = window.innerWidth;
    const midpoint = Math.floor(categories.length / 2);
    const isLeft = index < midpoint;
    const width = screenWidth < 768 ? screenWidth - 20 : 400;

    setDropdownStyles({
      left: isLeft ? "10px" : "auto",
      right: !isLeft ? "10px" : "auto",
      maxWidth: width,
      transform: "none",
    });

    setActiveCategory(categoryId);
  };

  const handleMenuLeave = () => {
    setActiveCategory(null);
  };

  return (
    <section className="hidden md:block w-full border-b bg-white/95 backdrop-blur-sm relative z-50">
      <nav className="px-4 min-h-14" onMouseLeave={handleMenuLeave}>
        <ul className="flex flex-wrap gap-1 justify-center max-w-(--breakpoint-2xl) mx-auto">
          {categories?.map((category, index) => (
            <li key={category.id} className="relative">
              <button
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={() => handleCategoryHover(category.id, index)}
                className="flex items-center gap-1.5 px-3 py-4 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                {category.name}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeCategory === category.id ? "-rotate-180" : ""
                  }`}
                />
              </button>
              {activeCategory === category.id && (
                <div
                  className="absolute top-full bg-white rounded-lg shadow-lg ring-1 ring-slate-900/5 p-6 mt-0.5 z-60 overflow-auto md:w-[250px] lg:w-[500px]"
                  style={dropdownStyles}
                  onMouseEnter={() => handleCategoryHover(category.id, index)}
                >
                  <div className="grid gap-6 w-full lg:grid-cols-[1fr_1.5fr]">
                    <div>
                      <Link
                        href={`/search?categoryId=${category.id}`}
                        className="flex h-full flex-col justify-end rounded-lg bg-linear-to-b from-slate-50 to-slate-100 p-6 no-underline outline-hidden ring-slate-900/5 transition-shadow hover:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-slate-900">
                          {category.name}
                        </div>
                        <p className="text-sm leading-tight text-slate-600">
                          Explore all {category.name.toLowerCase()} products
                        </p>
                      </Link>
                    </div>
                    <div className="grid gap-6">
                      {category.productSubcategory.length > 0 && (
                        <div>
                          <ul className="grid gap-2 sm:grid-cols-2">
                            {category.productSubcategory.map((subcategory) => (
                              <li key={subcategory.id}>
                                <Link
                                  href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
                                  className="block rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                  {subcategory.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {category.brands.length > 0 && (
                        <div>
                          <ul className="grid gap-2 sm:grid-cols-2">
                            {category.brands.map((brandItem) => (
                              <li key={brandItem.brand.id}>
                                <Link
                                  href={`/search?categoryId=${brandItem.categoryId}&brandId=${brandItem.brand.id}`}
                                  className="block rounded-md px-3 py-2 text-sm text-black hover:bg-slate-50 hover:text-slate-900"
                                >
                                  {brandItem.brand.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="h-px bg-slate-200" />
    </section>
  );
}
