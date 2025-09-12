import Image from "next/image";
import { Button } from "../shadcn-ui/button";
import Link from "next/link";
import { Tag } from "lucide-react";

export default function Banner() {
  return (
    <section className="mb-14">
      <div className="relative h-auto md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
        {/* Desktop Banner */}
        <Image
          src="/images/blackfriday.webp"
          alt="ShopTal - Discover amazing products and exclusive deals on fashion, electronics, and home goods"
          width={1920}
          height={1097}
          priority
          className="object-cover hidden md:block w-full h-full scale-105 transition-transform duration-700 hover:scale-110"
        />
        {/* Mobile Banner */}
        <Image
          src="/images/blackfridayM.webp"
          alt="ShopTal - Discover amazing products and exclusive deals on fashion, electronics, and home goods"
          width={960}
          height={548}
          priority
          className="object-cover block md:hidden w-full h-full scale-105 transition-transform duration-700 hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-8 z-20 text-white text-center">
          <div className="flex items-center gap-2 mb-2 animate-fade-in-down">
            <span className="inline-flex items-center bg-pink-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg">
              <Tag className="mr-1 w-4 h-4" /> New Collection
            </span>
          </div>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold mb-3 animate-fade-in-down drop-shadow-lg">
            Discover Amazing Products
          </h1>
          <p className="text-base md:text-2xl mb-4 md:mb-6 animate-fade-in-up max-w-xl mx-auto opacity-90">
            Shop the latest trends and exclusive deals on fashion, electronics, home goods, and more.
            <span className="font-bold text-pink-400"> Quality products</span> at great prices!
          </p>
          <Link href={"/search"}>
            <Button
              size="lg"
              className="animate-fade-in bg-pink-600 hover:bg-pink-700 transition-colors duration-200 shadow-xl px-8 py-3 text-lg font-semibold rounded-full"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
