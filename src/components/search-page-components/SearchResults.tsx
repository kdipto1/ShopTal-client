import { searchProducts } from "@/lib/api";
import { SearchParams } from "@/types";
import { ProductCard } from "@/components/search-page-components/ProductCard";
import { Pagination } from "@/components/search-page-components/Pagination";

interface SearchResultsProps {
  searchParams: SearchParams;
}

export default async function SearchResults({
  searchParams,
}: SearchResultsProps) {
  // const {
  //   data: { data: products, totalPages, currentPage },
  // } = await searchProducts(searchParams);
  // console.log(currentPage, totalPages);
  const data = await searchProducts(searchParams);
  const products = data.data.data;

  const currentPage = data?.data.meta.page;
  const limit = data?.data.meta.limit;
  const totalPages = Math.ceil(data?.data.meta.total / limit);

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">No products found</h2>
        <p className="text-gray-600 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={searchParams}
        pageLimit={limit}
      />
    </div>
  );
}
