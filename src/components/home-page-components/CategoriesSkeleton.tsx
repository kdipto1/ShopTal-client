import { Card, CardContent, CardFooter } from "../shadcn-ui/card";
import { Skeleton } from "../shadcn-ui/skeleton";

export default function CategoriesSkeleton() {
  return (
    <section className="mb-12">
      <Skeleton className="h-10 w-56 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="w-full h-[200px]" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
