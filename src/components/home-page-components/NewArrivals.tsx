import NewArrivalsCarousel from "./NewArrivalsCarousel";

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
    <section className="mb-14 md:px-10">
      <h2 className="text-3xl font-bold mb-6 text-primary">New Arrivals</h2>
      <NewArrivalsCarousel newArrivals={newArrivals} />
    </section>
  );
}
