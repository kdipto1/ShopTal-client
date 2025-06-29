"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useClickOutside from "@/hooks/useClickOutside";
import Image from "next/image";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SearchResultProps {
  product: Product;
  onSelect: () => void;
}

interface SearchResultsListProps {
  results: Product[];
  onSelect: () => void;
}

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SEARCH_DELAY = 400;
const MIN_SEARCH_LENGTH = 2;

// Custom debounce hook
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup on unmount or when callback/delay changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

// Individual Search Result Component
const SearchResult = ({ product, onSelect }: SearchResultProps) => (
  <Link
    href={`/product/${product.id}`}
    className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
    onClick={onSelect}
  >
    <Image
      src={product.image}
      alt={product.name}
      width={48}
      height={48}
      className="w-12 h-12 rounded-md object-cover"
    />
    <div>
      <p className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
        {product.name}
      </p>
      <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
    </div>
  </Link>
);

// Search Results List Component
const SearchResultsList = ({ results, onSelect }: SearchResultsListProps) => (
  <div className="grid gap-2 p-2">
    {results.map((product) => (
      <SearchResult key={product.id} product={product} onSelect={onSelect} />
    ))}
  </div>
);

// Search Component
export default function SearchProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicks outside of the search container
  useClickOutside(searchContainerRef, () => {
    setShowDropdown(false);
  });

  const debouncedSearch = useDebounce(async (term: string) => {
    if (term?.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/products?searchTerm=${term}`
      );
      const data = await response.json();
      setSearchResults(data?.data?.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, SEARCH_DELAY);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Close dropdown on Escape
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
    if (e.key === "Enter") {
      router.push(`/search?searchTerm=${searchTerm}`);
    }
  };

  const handleFocus = () => {
    if (searchTerm.length >= MIN_SEARCH_LENGTH && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div ref={searchContainerRef} className="relative">
      <div className="relative">
        <Link type="button" href={`/search?searchTerm=${searchTerm}`}>
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary" />
        </Link>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-8 pr-4 py-2 rounded-md border border-primary placeholder:text-primary focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-[300px] md:w-[200px] lg:w-[300px]"
          aria-label="Search products"
          aria-expanded={showDropdown}
          aria-controls="search-results"
          role="combobox"
        />
      </div>

      {/* Custom Dropdown */}
      {showDropdown && (
        <div
          id="search-results"
          className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto"
          role="listbox"
        >
          {isLoading ? (
            <div
              className="p-4 text-center text-gray-500"
              role="status"
              aria-live="polite"
            >
              Loading...
            </div>
          ) : searchResults.length > 0 ? (
            <SearchResultsList
              results={searchResults}
              onSelect={closeDropdown}
            />
          ) : (
            <div
              className="p-4 text-center text-gray-500"
              role="status"
              aria-live="polite"
            >
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
