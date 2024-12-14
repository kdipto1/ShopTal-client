import Link from "next/link";
import { Card } from "../shadcn-ui/card";
import { fetchCategories } from "@/lib/api";

// type Category = {
//   id: string;
//   name: string;
//   image: string;
// };

// async function fetchCategories(): Promise<Category[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=8&sortBy=createdAt&sortOrder=desc`,
//     { next: { revalidate: 60 } }
//     // { cache: "no-store" }
//   );
//   if (!res.ok) throw new Error("Failed to fetch categories");
//   const data = await res.json();
//   return data.data.data;
// }

export default async function Categories() {
  const categories = await fetchCategories();

  // <section className="mb-12">
  //   <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
  //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //     {categories.map((category) => (
  //       <Link
  //         key={category.id}
  //         href={`/search?categoryId=${category.id}`}
  //         className="group"
  //       >
  //         <Card className="overflow-hidden">
  //           <CardContent className="p-0">
  //             <div className="relative h-[200px]">
  //               <Image
  //                 src={"/classification.png"}
  //                 alt={category.name}
  //                 sizes="(min-width: 100px) 10vw, 20vw"
  //                 fill
  //                 className="object-contain transition-transform group-hover:scale-105"
  //               />
  //               <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
  //                 <h3 className="text-2xl font-bold text-white">
  //                   {category.name}
  //                 </h3>
  //               </div>
  //             </div>
  //           </CardContent>
  //           <CardFooter>
  //             <Button variant="ghost" className="w-full justify-between">
  //               View All <ChevronRight className="ml-2 h-4 w-4" />
  //             </Button>
  //           </CardFooter>
  //         </Card>
  //       </Link>
  //     ))}
  //   </div>
  // </section>
  return (
    <section className="mb-14">
      <h2 className="text-3xl font-bold mb-6 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {categories.map((category) => (
          <div key={category.id} className="group">
            {/* <Link key={category.id} href={`/search?categoryId=${category.id}`}> */}
            <Link
              key={category.id}
              href={`/search?categoryId=${category.id}`}
              className="rounded-full overflow-hidden border-4 border-black  flex items-center justify-center h-[150px] w-[150px] md:h-[200px] md:w-[200px] relative mx-auto bg-white duration-300 hover:scale-105 transition-all"
            >
              {/* <div className=" w-full "> */}
              <h3 className="text-lg font-bold text-black text-center">
                {category.name}
              </h3>
              {/* </div> */}
            </Link>
            {/* </Link> */}
          </div>
        ))}
      </div>
    </section>
  );
}
