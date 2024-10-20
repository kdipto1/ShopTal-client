"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, User, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/shadcn-ui/input";
import { Button } from "@/components/shadcn-ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const API_URL = "https://shoptal-server.vercel.app/api/v1/products";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchSearchResults = async (term: string) => {
    if (term?.length < 2) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?searchTerm=${term}`);
      const data = await response.json();
      console.log(data.data.data);
      setSearchResults(data.data.data || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // if (searchTerm?.length >= 2) {
    // fetchSearchResults(searchTerm);
    // }
    fetchSearchResults(searchTerm);
  }, [searchTerm]);

  return (
    <header className="sticky top-0  w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">YourShop</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:justify-between sm:space-x-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Popover
              open={isLoading || searchResults.length > 0}
              onOpenChange={setIsOpen}
            >
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                {isLoading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : searchResults.length > 0 ? (
                  <div className="grid gap-4 p-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-4"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">No results found</div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">User Account</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
