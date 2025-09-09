import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/shadcn-ui/sonner";
import Navbar from "@/components/shared-components/navbar-components/Navbar";
import Header from "@/components/shared-components/navbar-components/Header";
import Footer from "@/components/shared-components/Footer";
import MobileCategoryBrowser from "@/components/shared-components/navbar-components/MobileCategoryBrowser";
import BottomNavigation from "@/components/shared-components/navbar-components/BottomNavigation";
import NextAuthProvider from "@/components/shared-components/NextAuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fetchCategories } from "@/lib/api";
import { NavbarCategory } from "@/components/shared-components/navbar-components/MobileNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopTal",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories: NavbarCategory[] = await fetchCategories();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="dns-prefetch" href="http://res.cloudinary.com" />
      </head>
      <body className={`bg-gray-100 ${inter.className}`}>
        <NextAuthProvider>
          <Header>
            <MobileCategoryBrowser categories={categories} />
          </Header>
          <Navbar />
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNavigation categories={categories} />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </NextAuthProvider>
      </body>
    </html>
  );
}
