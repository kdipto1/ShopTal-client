// import * as React from "react";
// import { NavigationMenuLink } from "@/components/shadcn-ui/navigation-menu";
// import { cn } from "@/lib/utils";
// import Link from "next/link";

// interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
//   title: string;
//   href: string;
// }

// export const ListItem = React.memo(
//   React.forwardRef<React.ElementRef<"a">, ListItemProps>(
//     ({ className, title, href, children, ...props }, ref) => (
//       <li>
//         <NavigationMenuLink asChild>
//           <Link
//             ref={ref}
//             href={href}
//             className={cn(
//               "block select-none space-y-1 p-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//               className
//             )}
//             {...props}
//           >
//             <span className="text-sm font-medium leading-none">{title}</span>
//             {children && (
//               <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                 {children}
//               </span>
//             )}
//           </Link>
//         </NavigationMenuLink>
//       </li>
//     )
//   )
// );

// ListItem.displayName = "ListItem";
