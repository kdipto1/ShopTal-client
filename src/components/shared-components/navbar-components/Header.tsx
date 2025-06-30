"use client";
import { LogIn, ShoppingCart, User } from "lucide-react";
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
    <header className="sticky top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 flex h-14 items-center">
        <div className="mr-2 flex items-center">
          {children}
          <Link
            href="/"
            className="ml-2 md:ml-0 mr-4 flex items-center space-x-2 text-xl font-bold text-primary hover:text-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded"
            tabIndex={0}
            aria-label="Home"
          >
            <span>ShopTal</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchProducts />
          </div>
          <nav className="hidden md:flex items-center space-x-1 text-primary">
            <Link
              href={"/cart"}
              className="p-2 rounded hover:bg-pink-50 transition-colors flex text-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <Link
              href="/profile"
              className="p-2 rounded hover:bg-pink-50 transition-colors flex text-sm"
              aria-label="User Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="p-2 rounded hover:bg-pink-50 transition-colors flex text-sm"
              aria-label="User Account"
            >
              <LogIn className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
