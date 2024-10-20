import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/shadcn-ui/sonner";
import Navbar from "@/components/shared-components/navbar-components/Navbar";
import Header from "@/components/shared-components/navbar-components/Header";

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
        <Header />
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
