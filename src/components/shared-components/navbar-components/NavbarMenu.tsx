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

"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/shadcn-ui/navigation-menu";
import { ListItem } from "./NavigationList";
import { useNavigation } from "@/hooks/useNavigation";
import Link from "next/link";

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

export function NavigationMenuDemo() {
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

  const renderSubcategories = (category: Category) => {
    if (!category?.productSubcategory?.length && !category.brands?.length) {
      return null;
    }

    return (
      <NavigationMenuContent className="max-w-screen-xl mx-auto">
        {category?.productSubcategory?.length > 0 && (
          <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {category?.productSubcategory?.map((subcategory) => (
              <ListItem
                key={subcategory.id}
                title={subcategory.name}
                href={`/search?categoryId=${category.id}&subcategoryId=${subcategory.id}`}
              />
            ))}
          </ul>
        )}
        {category?.brands?.length > 0 && (
          <ul className="grid w-[400px] gap-1 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {category.brands.map((brand) => (
              <ListItem
                key={brand.id}
                title={brand.name}
                href={`/search?brandId=${brand.id}`}
              />
            ))}
          </ul>
        )}
      </NavigationMenuContent>
    );
  };

  return (
    <NavigationMenu className="max-w-screen-xl mx-auto">
      <NavigationMenuList>
        {categories?.map((category) => (
          <NavigationMenuItem key={category.id}>
            <Link href={`/search?categoryId=${category.id}`}>
              <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
            </Link>
            {renderSubcategories(category)}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
