"use client";
import { NavigationMenuDemo } from "./NavbarMenu";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return pathname !== "/dashboard" ? (
    <div className="flex flex-wrap justify-center">
      <NavigationMenuDemo />
    </div>
  ) : (
    ""
  );
};

export default Navbar;
