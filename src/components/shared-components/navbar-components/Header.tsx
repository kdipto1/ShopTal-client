// "use client";
// import { useState, useCallback, useRef } from "react";
// import { ShoppingCart, User, Search } from "lucide-react";

// import Link from "next/link";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/shadcn-ui/popover";

// // Types
// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
// }

// interface SearchResultProps {
//   product: Product;
// }

// interface SearchResultsListProps {
//   results: Product[];
// }

// // Constants
// const API_URL = "http://localhost:5000/api/v1/products";
// const SEARCH_DELAY = 300;
// const MIN_SEARCH_LENGTH = 2;

// // Custom debounce hook
// const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
//   const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

//   return useCallback(
//     (...args: any[]) => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }

//       const newTimeoutId = setTimeout(() => {
//         callback(...args);
//       }, delay);

//       setTimeoutId(newTimeoutId);
//     },
//     [callback, delay]
//   );
// };

// // Individual Search Result Component
// const SearchResult = ({ product }: SearchResultProps) => (
//   <Link
//     href={`/product/${product.id}`}
//     className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
//   >
//     <img
//       src={product.image}
//       alt={product.name}
//       className="w-12 h-12 rounded-md object-cover"
//     />
//     <div>
//       <p className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
//         {product.name}
//       </p>
//       <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
//     </div>
//   </Link>
// );

// // Search Results List Component
// const SearchResultsList = ({ results }: SearchResultsListProps) => (
//   <div className="grid gap-2 p-2">
//     {results.map((product) => (
//       <SearchResult key={product.id} product={product} />
//     ))}
//   </div>
// );

// // Search Component
// const SearchProducts = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const debouncedSearch = useDebounce(async (term: string) => {
//     if (term?.length < MIN_SEARCH_LENGTH) {
//       setSearchResults([]);
//       setIsOpen(false);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}?searchTerm=${term}`);
//       const data = await response.json();
//       setSearchResults(data?.data?.data || []);
//       setIsOpen(true);
//       inputRef.current?.focus();
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//       setSearchResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, SEARCH_DELAY);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     debouncedSearch(value);
//   };

//   return (
//     <Popover
//       open={isOpen && (isLoading || searchResults.length > 0)}
//       // onOpenChange={setIsOpen}
//       onOpenChange={(open) => {
//         setIsOpen(open);
//         // Maintain focus when popover closes
//         if (!open) {
//           inputRef.current?.focus();
//         }
//       }}
//     >
//       <PopoverTrigger asChild>
//         <div className="relative">
//           <Link href={`/search?searchTerm=${searchTerm}`}>
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//           </Link>
//           <input
//             type="search"
//             placeholder="Search products..."
//             ref={inputRef}
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-[300px] md:w-[200px] lg:w-[300px]"
//             aria-label="Search products"
//           />
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="w-[300px] p-0" align="start">
//         {isLoading ? (
//           <div
//             className="p-4 text-center text-gray-500"
//             role="status"
//             aria-live="polite"
//           >
//             Loading...
//           </div>
//         ) : searchResults.length > 0 ? (
//           <SearchResultsList results={searchResults} />
//         ) : (
//           <div
//             className="p-4 text-center text-gray-500"
//             role="status"
//             aria-live="polite"
//           >
//             No results found
//           </div>
//         )}
//       </PopoverContent>
//     </Popover>
//   );
// };

// // Main Header Component
// const Header = () => {
//   return (
//     <header className="sticky top-0 w-full border-b bg-white bg-opacity-95 backdrop-blur z-50">
//       <div className="max-w-7xl mx-auto px-4 flex h-14 items-center">
//         <div className="mr-4 hidden md:flex">
//           <Link href="/" className="mr-6 flex items-center space-x-2">
//             <span className="hidden font-bold sm:inline-block">ShopTal</span>
//           </Link>
//         </div>
//         <div className="flex flex-1 items-center justify-end space-x-2 sm:justify-between sm:space-x-4 md:justify-end">
//           <div className="w-full flex-1 md:w-auto md:flex-none">
//             <SearchProducts />
//           </div>
//           <nav className="flex items-center space-x-2">
//             <Link
//               href={"/cart"}
//               className="p-2 rounded-md hover:bg-gray-100 transition-colors"
//               aria-label="Shopping Cart"
//             >
//               <ShoppingCart className="h-5 w-5" />
//             </Link>
//             <button
//               className="p-2 rounded-md hover:bg-gray-100 transition-colors"
//               aria-label="User Account"
//             >
//               <User className="h-5 w-5" />
//             </button>
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        callback(...args);
      }, delay);

      setTimeoutId(newTimeoutId);
    },
    [callback, delay]
  );
};

// Custom hook for handling clicks outside
const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// Individual Search Result Component
const SearchResult = ({ product, onSelect }: SearchResultProps) => (
  <Link
    href={`/product/${product.id}`}
    className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-md transition-colors"
    onClick={onSelect}
  >
    <img
      src={product.image}
      alt={product.name}
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
const SearchProducts = () => {
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
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </Link>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-[300px] md:w-[200px] lg:w-[300px]"
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
};

// Main Header Component
const Header = () => {
  return (
    <header className="sticky top-0 w-full bg-white bg-opacity-95 backdrop-blur z-50">
      <div className="max-w-7xl mx-auto px-4 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">ShopTal</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:justify-between sm:space-x-4 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchProducts />
          </div>
          <nav className="flex items-center space-x-2">
            <Link
              href={"/cart"}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <Link
              href="/profile"
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="User Account"
            >
              <User className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
