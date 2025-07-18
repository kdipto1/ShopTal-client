import NewArrivalsCarousel from "./NewArrivalsCarousel";
import { Sparkles } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

async function fetchNewArrivals(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=8&sortBy=createdAt&sortOrder=desc`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 120 },
      // cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch new arrivals");
  const data = await res.json();
  return data.data.data;
}

export default async function NewArrivals() {
  const newArrivals = await fetchNewArrivals();

  return (
    <section className="pt-4 mb-14 bg-gradient-to-br from-pink-50/60 to-white rounded-2xl shadow-lg py-10 px-2 md:py-14 md:px-12 border border-pink-100 animate-fade-in-up">
      <div className="flex flex-col items-center mb-6">
        <span className="inline-flex items-center gap-2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow animate-fade-in-down mb-2">
          <Sparkles className="w-4 h-4" /> New
        </span>
        <h2 className="text-3xl font-bold text-primary animate-fade-in-down mb-1 text-center">
          New Arrivals
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 rounded-full mb-3 animate-fade-in-up" />
        <p className="text-base text-gray-500 text-center max-w-xl animate-fade-in-up">
          Discover the latest additions to our collection. Fresh styles and
          trending products, just for you!
        </p>
      </div>
      <NewArrivalsCarousel newArrivals={newArrivals} />
    </section>
  );
}
