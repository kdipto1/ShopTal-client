import Banner from "@/components/home-page-components/Banner";
import Categories from "@/components/home-page-components/Categories";
import CategoriesSkeleton from "@/components/home-page-components/CategoriesSkeleton";
import NewArrivals from "@/components/home-page-components/NewArrivals";
import NewArrivalsSkeleton from "@/components/home-page-components/NewArrivalsSkeleton";
import RandomProducts from "@/components/home-page-components/RandomProducts";
import RandomProductsSkeleton from "@/components/home-page-components/RandomProductsSkeleton";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Banner />
      <Suspense fallback={<NewArrivalsSkeleton />}>
        {/* @ts-expect-error Async Server Component */}
        <NewArrivals />
      </Suspense>
      <Suspense fallback={<CategoriesSkeleton />}>
        {/* @ts-expect-error Async Server Component */}
        <Categories />
      </Suspense>
      <Suspense fallback={<RandomProductsSkeleton />}>
        {/* @ts-expect-error Async Server Component */}
        <RandomProducts />
      </Suspense>
    </div>
  );
}
