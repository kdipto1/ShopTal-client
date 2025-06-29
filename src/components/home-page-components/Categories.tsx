import Link from "next/link";

type Category = {
  id: string;
  name: string;
  image: string;
};

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=8&sortBy=createdAt&sortOrder=desc`,
    { next: { revalidate: 60 } }
    // { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.data.data;
}

export default async function Categories() {
  const categories = await fetchCategories();

  return (
    <section className="mb-14">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {categories.map((category) => (
          <div key={category.id} className="group mx-auto">
            {/* <Link
              key={category.id}
              href={`/search?categoryId=${category.id}`}
              className="rounded-full overflow-hidden border-4 border-black  flex items-center justify-center h-[150px] w-[150px] md:h-[100px] md:w-[300px] relative mx-auto bg-white duration-300 hover:scale-105 transition-all"
            >
              <h3 className="text-lg font-bold text-black text-center">
                {category.name}
              </h3>
              //  h-[80px] w-[170px] 
            </Link> */}
            <Link
              key={category.id}
              href={`/search?categoryId=${category.id}`}
              className="relative rounded-full overflow-hidden border-4 border-primary hover:border-white flex items-center justify-center 
               h-16 w-40   md:h-14 md:w-56 lg:h-16 lg:w-60
              xl:h-24 xl:w-72 bg-white duration-300  transition-all mx-auto text-primary hover:text-white"
            >
              <h3 className="text-base md:text-base font-bold text-center z-10 relative">
                {category.name}
              </h3>
              <div className="absolute bottom-0 left-0 w-full h-0 bg-[#e11d47] transition-all duration-300 group-hover:h-full"></div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
