"use client";
import { NavigationMenuDemo } from "./NavbarMenu";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/login", "/signup"];

  const isDashboardRoute = pathname.startsWith("/dashboard");

  const isHiddenRoute = hideNavbarRoutes.includes(pathname);

  const shouldHideNavbar = isDashboardRoute || isHiddenRoute;

  return !shouldHideNavbar ? (
    <div className="flex flex-wrap justify-center">
      <NavigationMenuDemo />
    </div>
  ) : (
    <></>
  );
};

export default Navbar;
