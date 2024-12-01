"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/shadcn-ui/separator";
import NavbarMenu from "./NavbarMenu";

const Navbar = () => {
  const router = usePathname();

  const shouldHide = router.includes("/dashboard");

  if (shouldHide) {
    return null;
  }

  return (
    <section className="hidden md:block w-full border-b bg-white/95 backdrop-blur relative z-50">
      <div className="flex h-14 items-center justify-center">
        <NavbarMenu />
      </div>
      <Separator />
    </section>
  );
};

export default Navbar;
