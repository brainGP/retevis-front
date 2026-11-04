"use client";

import React from "react";
import Image from "next/image";
import data from "@/data/products.json";

const LogoSlider: React.FC = () => {
  const logos = data[0]?.logos || [];

  return (
    <section className="w-full overflow-hidden py-5 sm:py-7" aria-labelledby="brands-heading">
      <div className="site-container mb-5 flex items-center gap-3 sm:mb-6">
        <span className="h-2 w-2 rounded-full bg-yellow" />
        <h2 id="brands-heading" className="text-lg font-semibold text-gray">Брэндүүд</h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-8 sm:gap-10">
          {[...logos, ...logos].map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="w-28 flex-shrink-0 sm:w-40 lg:w-48">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={100}
                className="h-14 w-full object-contain sm:h-16"
                priority={index < logos.length}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoSlider;
