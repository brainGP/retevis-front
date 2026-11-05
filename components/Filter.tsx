"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import data from "@/data/products.json";
import { useSearchParams } from "next/navigation";

const Filter = () => {
  const logos = data[0]?.logos || [];
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand") as string;

  return (
    <aside className="max-w-[250px] md:block hidden min-w-[200px]">
      <div className="sticky top-16 m-4 rounded-lg border bg-white">
        <div className="flex flex-col justify-center items-center">
          <div className="w-full border-b p-4">
            <h3 className="w-full font-semibold text-lg md:text-xl">
              Брэндүүд :
            </h3>
          </div>

          <div className="flex flex-col gap-4 p-4">
            {logos.map((logo, index) => {
              const isActive = brand && logo.name == brand;
              const href = isActive
                ? "/stations"
                : `/stations/?brand=${logo.name}`;
              return (
                <Link
                  key={index}
                  href={href}
                  passHref
                  className={`hover:bg-gray/[5%] transition-all w-full py-4 flex rounded justify-center min-w-[150px] cursor-pointer ${
                    isActive && " bg-gray/5"
                  }`}
                >
                  <div>
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={120}
                      height={60}
                      style={{ objectFit: "contain" }}
                      priority={true}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Filter;
