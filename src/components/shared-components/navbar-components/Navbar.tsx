"use client";

import { usePathname } from "next/navigation";
import ResponsiveMenu from "./NavbarMenu";
import { Separator } from "@/components/shadcn-ui/separator";
// import { useMemo } from "react";

// const HIDDEN_ROUTES = ["/login", "/signup"] as const;

const Navbar = () => {
  // const pathname = usePathname();

  // const shouldHideNavbar = useMemo(() => {
  //   return (
  //     HIDDEN_ROUTES.includes(pathname as (typeof HIDDEN_ROUTES)[number]) ||
  //     pathname.startsWith("/dashboard")
  //   );
  // }, [pathname]);

  // if (shouldHideNavbar) {
  //   return null;
  // }

  const router = usePathname();

  const shouldHide = router.includes("/dashboard");

  if (shouldHide) {
    return null; // Don't render the component if on a specific route
  }

  return (
    <nav className="w-full border-b bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center justify-center">
        <ResponsiveMenu />
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
