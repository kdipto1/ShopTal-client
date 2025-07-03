import Link from "next/link";

type Category = {
  id: string;
  name: string;
  image: string;
};

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=10&sortBy=createdAt&sortOrder=desc`,
    { next: { revalidate: 60 } }
    // { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.data.data;
}

// Utility to generate a color from a string
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 70%)`;
  return color;
}

export default async function Categories() {
  const categories = await fetchCategories();

  return (
    <section className="mb-14">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary tracking-tight">
        Shop by Category
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/search?categoryId=${category.id}`}
            className="group flex flex-col items-center justify-center bg-white rounded-xl border border-pink-100 hover:border-pink-400 shadow-sm hover:shadow-md transition-all duration-200 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-52 xl:h-52 mx-auto relative overflow-hidden"
          >
            <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mt-3 mb-2 rounded-full border border-pink-100 bg-gray-50 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <span
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold select-none"
                style={{
                  color: "#fff",
                  background: stringToColor(category.name),
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "9999px",
                }}
              >
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-center z-10 relative text-primary group-hover:text-pink-600 transition-colors duration-200">
              {category.name}
            </h3>
            <div className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-80 transition-opacity duration-200 z-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
