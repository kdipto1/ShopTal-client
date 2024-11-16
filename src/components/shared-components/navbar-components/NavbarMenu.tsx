// "use client";

// import * as React from "react";

// import { cn } from "@/lib/utils";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/shadcn-ui/navigation-menu";

// export function NavigationMenuDemo() {
//   const [data, setData] = React.useState([]);
//   const fetchNavbarCategory = async () => {
//     const response = await fetch(
//       "http://localhost:5000/api/v1/categories/navbar-category"
//     );
//     const data = await response.json();
//     setData(data.data);
//   };

//   React.useEffect(() => {
//     fetchNavbarCategory();
//   }, []);

//   return (
//     <NavigationMenu>
//       <NavigationMenuList>
//         {data?.map((category: any) => (
//           <NavigationMenuItem key={category?.id}>
//             <NavigationMenuTrigger>{category?.name}</NavigationMenuTrigger>
//             <NavigationMenuContent>
//               {category?.productSubcategory?.length > 0 ? (
//                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//                   {category?.productSubcategory?.map((subcategory: any) => (
//                     <ListItem
//                       key={subcategory?.id}
//                       title={subcategory?.name}
//                       // href={component.href}
//                     >
//                       {/* {component.description} */}
//                     </ListItem>
//                   ))}
//                 </ul>
//               ) : (
//                 ""
//               )}
//               {category?.brands?.length > 0 ? (
//                 <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//                   {category?.brands?.map((brand: any) => (
//                     <ListItem
//                       key={brand?.id}
//                       title={brand?.name}
//                       // href={component.href}
//                     >
//                       {/* {component.description} */}
//                     </ListItem>
//                   ))}
//                 </ul>
//               ) : (
//                 ""
//               )}
//             </NavigationMenuContent>
//           </NavigationMenuItem>
//         ))}
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// }

// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });
// ListItem.displayName = "ListItem";

/** ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

// "use client";

// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/shadcn-ui/navigation-menu";
// import { ListItem } from "./NavigationList";
// import { useNavigation } from "@/hooks/useNavigation";
// import Link from "next/link";

// interface Brand {
//   id: string;
//   name: string;
// }

// interface ProductSubcategory {
//   id: string;
//   name: string;
// }

// interface Category {
//   id: string;
//   name: string;
//   productSubcategory: ProductSubcategory[];
//   brands: Brand[];
// }

// export function NavigationMenuDemo() {
//   const { categories, isLoading, error } = useNavigation();

//   if (isLoading) {
//     return <div className="flex justify-center p-4">Loading navigation...</div>;
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center p-4 text-red-500">
//         Error loading navigation
//       </div>
//     );
//   }

//   const renderSubcategories = (category: Category) => {
//     if (!category?.productSubcategory?.length && !category.brands?.length) {
//       return null;
//     }

//     return (
//       <NavigationMenuContent className="max-w-screen-xl mx-auto">
//         {category?.productSubcategory?.length > 0 && (
//           <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//             {category?.productSubcategory?.map((subcategory) => (
//               <ListItem
//                 key={subcategory.id}
//                 title={subcategory.name}
//                 href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
//               />
//             ))}
//           </ul>
//         )}
//         {category?.brands?.length > 0 && (
//           <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//             {category.brands.map((brand) => (
//               <ListItem
//                 key={brand.id}
//                 title={brand.name}
//                 href={`/search?brandId=${brand.id}`}
//               />
//             ))}
//           </ul>
//         )}
//       </NavigationMenuContent>
//     );
//   };

//   return (
//     <NavigationMenu className="max-w-screen-xl mx-auto">
//       <NavigationMenuList>
//         {categories?.map((category) => (
//           <NavigationMenuItem key={category.id}>
//             <Link href={`/search?categoryId=${category.id}`}>
//               <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
//             </Link>
//             {renderSubcategories(category)}
//           </NavigationMenuItem>
//         ))}
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// }

/***
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

// Main Navigation Menu Component

// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/shadcn-ui/navigation-menu";
// import { ListItem } from "./NavigationList";
// import { useNavigation } from "@/hooks/useNavigation";
// import Link from "next/link";
// import { cn } from "@/lib/utils";

// interface Brand {
//   id: string;
//   name: string;
// }

// interface ProductSubcategory {
//   id: string;
//   name: string;
// }

// interface Category {
//   id: string;
//   name: string;
//   productSubcategory: ProductSubcategory[];
//   brands: Brand[];
// }

// export function NavigationMenuDemo() {
//   const { categories, isLoading, error } = useNavigation();

//   if (isLoading) {
//     return <div className="flex justify-center p-4">Loading navigation...</div>;
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center p-4 text-red-500">
//         Error loading navigation
//       </div>
//     );
//   }

//   const CategoryContent = ({ category }: { category: Category }) => {
//     if (!category.productSubcategory?.length && !category.brands?.length) {
//       return null;
//     }

//     return (
//       <NavigationMenuContent className="">
//         {category.productSubcategory.length > 0 && (
//           <ItemList
//             items={category.productSubcategory}
//             urlPrefix={`/search?categoryId=${category.id}&subcategoryId=`}
//           />
//         )}
//         {category.brands.length > 0 && (
//           <ItemList items={category.brands} urlPrefix={`/search?brandId=`} />
//         )}
//       </NavigationMenuContent>
//     );
//   };

//   return (
//     <NavigationMenu className="max-w-screen-xl mx-auto">
//       <NavigationMenuList>
//         {categories?.map((category) => (
//           <NavigationMenuItem className="relative" key={category.id}>
//             <Link href={`/search?categoryId=${category.id}`}>
//               <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
//             </Link>
//             <CategoryContent category={category} />
//           </NavigationMenuItem>
//         ))}
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// }

// // ItemList Component

// const ItemList = ({
//   items,
//   urlPrefix,
// }: {
//   items: Array<{ id: string; name: string }>;
//   urlPrefix: string;
// }) => (
//   <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//     {items.map((item) => (
//       <ListItem
//         key={item.id}
//         title={item.name}
//         href={`${urlPrefix}${item.id}`}
//       />
//     ))}
//   </ul>
// );

/******************************************** tailwind */

// import React from "react";
// import Link from "next/link";
// import { useNavigation } from "@/hooks/useNavigation";

// interface Brand {
//   id: string;
//   name: string;
// }

// interface ProductSubcategory {
//   id: string;
//   name: string;
// }

// interface Category {
//   id: string;
//   name: string;
//   productSubcategory: ProductSubcategory[];
//   brands: Brand[];
// }

// export function NavigationMenuDemo() {
//   const { categories, isLoading, error } = useNavigation();

//   if (isLoading) {
//     return <div className="flex justify-center p-4">Loading navigation...</div>;
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center p-4 text-red-500">
//         Error loading navigation
//       </div>
//     );
//   }

//   return (
//     <nav className="max-w-screen-xl mx-auto">
//       <ul className="flex space-x-4">
//         {categories?.map((category) => (
//           <li key={category.id} className="relative group">
//             <Link href={`/search?categoryId=${category.id}`}>
//               <span className="cursor-pointer p-2 hover:text-blue-600">
//                 {category.name}
//               </span>
//             </Link>
//             {/* Submenu */}
//             <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg border rounded-md mt-1 p-4 w-[600px] z-10">
//               <SubcategoryList category={category} />
//             </div>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }

// // SubcategoryList Component

// const SubcategoryList = ({ category }: { category: Category }) => {
//   return (
//     <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
//       {category.productSubcategory.length > 0 && (
//         <ul className="grid gap-2 md:w-1/2">
//           <span className="font-semibold text-gray-700">Subcategories</span>
//           {category.productSubcategory.map((subcategory) => (
//             <li key={subcategory.id}>
//               <Link
//                 href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
//               >
//                 <span className="block text-sm text-gray-600 hover:text-blue-600">
//                   {subcategory.name}
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//       {category.brands.length > 0 && (
//         <ul className="grid gap-2 md:w-1/2">
//           <span className="font-semibold text-gray-700">Brands</span>
//           {category.brands.map((brand) => (
//             <li key={brand.id}>
//               <Link href={`/search?brandId=${brand.id}`}>
//                 <span className="block text-sm text-gray-600 hover:text-blue-600">
//                   {brand.name}
//                 </span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

/******                           v0                 +++++++++++++++++++++++++++++++++++++++ */

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
