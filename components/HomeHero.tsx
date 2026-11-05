"use client";

import Link from "next/link";
import { ArrowRight, Building2, Compass, Radio, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNewProducts } from "@/apis/products";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/utils/formatPrice";

const useCases = [
  {
    title: "Аялал, хөдөө",
    note: "Авч явахад тохиромжтой",
    href: "/stations?type=handstation",
    Icon: Compass,
  },
  {
    title: "Багийн ажил",
    note: "Талбай, агуулах, хамгаалалт",
    href: "/stations?type=handstation",
    Icon: Building2,
  },
  {
    title: "Суурин холбоо",
    note: "Машин болон ажлын байр",
    href: "/stations?type=basestation",
    Icon: Radio,
  },
];

export default function HomeHero() {
  const { data: products = [] } = useQuery({
    queryKey: ["new", "products"],
    queryFn: getNewProducts,
    staleTime: 2 * 60 * 1000,
  });
  const featuredProduct = products.find((product) => product.images?.some((image) => Boolean(image?.image))) ?? products[0];

  return (
    <section className="site-container pt-4 sm:pt-6" aria-labelledby="home-heading">
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:gap-6 sm:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-8">
        <div className="flex min-w-0 flex-col justify-center py-1 sm:py-3">
          <p className="text-sm font-medium text-amber-800">Сонголтоо хэрэглээнээсээ эхлүүлээрэй</p>
          <h1 id="home-heading" className="mt-2 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.7rem]">
            Танд ямар станц хэрэгтэй вэ?
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Хаана, юунд ашиглахаа сонгоод тохирох загваруудаа үзээрэй.
          </p>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {useCases.map(({ title, note, href, Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex min-h-[76px] min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 transition-colors hover:border-amber-400 hover:bg-amber-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors group-hover:bg-amber-100 group-hover:text-amber-900">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900">{title}</span>
                  <span className="mt-0.5 block text-xs leading-4 text-slate-500">{note}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-700" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <Link href="/stations?type=equipments" className="mt-4 inline-flex min-h-9 w-fit items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-amber-800">
            <Wrench className="h-4 w-4" aria-hidden="true" /> Дагалдах хэрэгсэл үзэх <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {featuredProduct && (
          <Link
            href={`/stations/${encodeURIComponent(featuredProduct.name)}`}
            className="group relative block min-h-[260px] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-[#f4f2ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:min-h-[320px] lg:min-h-[390px]"
            aria-label={`${featuredProduct.name} бүтээгдэхүүний дэлгэрэнгүйг үзэх`}
          >
            <div className="absolute left-3 top-3 z-10 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm sm:left-4 sm:top-4">
              Танд санал болгох бараа
            </div>
            <ProductImage
              src={featuredProduct.images?.[0]?.image}
              alt={featuredProduct.name}
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-contain p-5 mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.035] sm:p-8"
              priority
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:inset-x-4 sm:bottom-4 sm:p-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{featuredProduct.brand}</p>
                <h2 className="mt-1 truncate text-base font-semibold text-slate-900 sm:text-lg">{featuredProduct.name}</h2>
              </div>
              <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-900 sm:text-base">
                {formatPrice(featuredProduct.priceN)}₮
                <ArrowRight className="h-4 w-4 text-amber-700 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
