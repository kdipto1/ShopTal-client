"use client";

import { usePathname } from "next/navigation";
import ResponsiveMenu from "./NavbarMenu";
import { useMemo } from "react";

const HIDDEN_ROUTES = ["/login", "/signup"] as const;

const Navbar = () => {
  const pathname = usePathname();

  const shouldHideNavbar = useMemo(() => {
    return (
      HIDDEN_ROUTES.includes(pathname as (typeof HIDDEN_ROUTES)[number]) ||
      pathname.startsWith("/dashboard")
    );
  }, [pathname]);

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className="sticky top-0 w-full border-b bg-white/95 backdrop-blur z-40">
      <div className="flex h-14 items-center justify-center">
        <ResponsiveMenu />
      </div>
    </nav>
  );
};

export default Navbar;
