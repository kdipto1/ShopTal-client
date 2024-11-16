import Image from "next/image";
import { Button } from "../shadcn-ui/button";

export default function Banner() {
  return (
    <section className="mb-12">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt="Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 bg-black bg-opacity-50 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Summer Sale
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Up to 50% off on selected items
          </p>
          <Button size="lg">Shop Now</Button>
        </div>
      </div>
    </section>
  );
}
