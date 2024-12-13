import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/shadcn-ui/sonner";
import Navbar from "@/components/shared-components/navbar-components/Navbar";
import Header from "@/components/shared-components/navbar-components/Header";
import Footer from "@/components/shared-components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MobileNavbar from "@/components/shared-components/navbar-components/MobileNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopTal",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`bg-gray-100 ${inter.className}`}>
        <Header>
          <MobileNavbar />
        </Header>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
