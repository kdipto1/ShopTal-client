"use client";
import { ShoppingCart, User, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchProducts from "./HeaderSearchProducts";

export default function Header({ children }: { children: any }) {
  const router = usePathname();

  // Check if the current route is in the hideOnRoutes array
  const shouldHide = router.includes("/dashboard");

  if (shouldHide) {
    return null; // Don't render the component if on a specific route
  }

  return (
    <header className="w-full bg-white bg-opacity-95 backdrop-blur relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 flex h-14 items-center">
        <div className="mr-4 flex">
          {/* <MobileNavbar /> */}
          {children}
          <Link href="/" className="mr-6 flex items-center space-x-2 text-2xl">
            <span className="font-bold">ShopTal</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:justify-between sm:space-x-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchProducts />
          </div>
          <nav className="hidden  md:flex items-center space-x-2">
            <Link
              href={"/cart"}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors flex"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" /> &nbsp; Cart
            </Link>
            <Link
              href="/profile"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors flex"
              aria-label="User Account"
            >
              <User className="h-5 w-5" /> &nbsp; Profile
            </Link>

            <Link
              href="/login"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors flex"
              aria-label="User Account"
            >
              <LogIn className="h-5 w-5" /> &nbsp; Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
