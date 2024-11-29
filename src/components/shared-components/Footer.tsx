"use client";
import Link from "next/link";

import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CreditCard,
  PlayIcon,
  // ApplePay,
  // GooglePay,
} from "lucide-react";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";
import { Separator } from "../shadcn-ui/separator";
import { usePathname } from "next/navigation";

export default function Footer() {
  const router = usePathname();

  // Define the routes where you want to hide the component
  const hideOnRoutes = ["/dashboard", "/another-route"];

  // Check if the current route is in the hideOnRoutes array
  const shouldHide = router.includes("/dashboard");

  if (shouldHide) {
    return null; // Don't render the component if on a specific route
  }
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">ShopTal</h2>
            <p className="text-sm">
              Your Trusted Hub for Cutting-Edge Electronics
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:underline">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:underline">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:underline">
                  Deals & Promotions
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter SignUp */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
            <p className="mb-4 text-sm">
              Subscribe to our newsletter for exclusive deals and updates.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} ShopTal. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <CreditCard className="h-6 w-6" />
            {/* <PaypalIcon className="h-6 w-6" /> */}
            {/* <ApplePay className="h-6 w-6" />
            <GooglePay className="h-6 w-6" /> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
