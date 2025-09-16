import { getCategories } from "@/lib/api";
import { SearchParams } from "@/types";
import SearchPageClient from "@/components/search-page-components/SearchPageClient";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const parsedParams: SearchParams = {
    searchTerm: searchParams.searchTerm,
    category: searchParams.category,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: searchParams.limit ? Number(searchParams.limit) : 12,
    categoryId: searchParams.categoryId,
    subcategoryId: searchParams.subcategoryId,
    brandId: searchParams.brandId,
  };

  const {
    data: { data: categories },
  } = await getCategories({ limit: 20 });

  return (
    <SearchPageClient
      initialSearchParams={parsedParams}
      categories={categories}
    />
  );
}
