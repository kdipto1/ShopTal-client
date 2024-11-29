"use client";

import { usePathname } from "next/navigation";
import ResponsiveMenu from "./NavbarMenu";
import { Separator } from "@/components/shadcn-ui/separator";

const Navbar = () => {
  const router = usePathname();

  const shouldHide = router.includes("/dashboard");

  if (shouldHide) {
    return null;
  }

  return (
    <nav className="hidden md:block w-full border-b bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center justify-center">
        <ResponsiveMenu />
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
