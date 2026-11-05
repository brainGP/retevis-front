"use client";

import React, { useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { getBanners } from "@/apis/banner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import CarouselSkeleton from "@/skeletons/CarouselSkeleton";

interface Banner {
  _id: string;
  image: string;
}

const fetchBanners = async (): Promise<Banner[]> => {
  const banners = await getBanners();
  return banners;
};

const CarouselComponent = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  const {
    data: banners = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  useEffect(() => {
    const plugin = autoplayPlugin.current;
    return () => {
      plugin.reset();
    };
  }, []);

  if (isLoading) return <CarouselSkeleton />;
  if (isError) return (
    <div className="site-container py-5">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center" role="alert">
        <p className="text-sm text-slate-600">Онцлох мэдээлэл ачаалсангүй.</p>
        <button type="button" onClick={() => void refetch()} className="mt-2 text-sm font-medium text-amber-800 hover:underline">Дахин ачаалах</button>
      </div>
    </div>
  );
  if (!banners.length) return null;

  return (
    <div className="relative w-full flex justify-center items-start md:items-center overflow-hidden">
      <Carousel
        plugins={[autoplayPlugin.current]}
        className="relative w-full h-[30vh] sm:h-[40vh] md:h-[60vh]"
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
      >
        <CarouselContent>
          {banners.map((banner, index) => {
            return (
              <CarouselItem key={banner._id}>
                <div className="relative w-full h-[30vh] sm:h-[40vh] md:h-[60vh]">
                  <Image
                    src={banner.image}
                    alt={`Retevis Mongolia-ийн онцлох мэдээлэл ${index + 1}`}
                    className="object-cover object-center"
                    priority={index === 0}
                    fill
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute left-8 lg:left-16 h-6 w-6 lg:h-8 lg:w-8 hover:-translate-y-1/2" />

        <CarouselNext className="absolute right-8 lg:right-16 h-6 w-6 lg:h-8 lg:w-8 hover:-translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
