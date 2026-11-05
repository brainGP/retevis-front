"use client";
import React, { useState, useCallback, useEffect } from "react";
import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";
import { useCart } from "@/hooks/useCarts";
import { Rating } from "@mui/material";
import { formatPrice } from "@/utils/formatPrice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import BatteryIcon from "@/public/icons/battery";
import ShareProductButton from "@/components/ShareProductButton";
import { useOpenMessengerInquiry } from "@/components/MessengerInquiry";
import { ChevronLeft, ChevronRight, Images, Maximize2, MessageCircle, X } from "lucide-react";

const StationCard = ({ station, canonicalUrl }: { station: Product; canonicalUrl: string }) => {
  const productImages = Array.isArray(station.images) ? station.images : [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const imageSignature = productImages.map(({ image }) => image).join("|");

  useEffect(() => {
    setSelectedImageIndex(0);
    setIsGalleryOpen(false);
  }, [station._id, imageSignature]);

  useEffect(() => {
    if (!isGalleryOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsGalleryOpen(false);
      if (event.key === "ArrowRight") setSelectedImageIndex((index) => (index + 1) % Math.max(productImages.length, 1));
      if (event.key === "ArrowLeft") setSelectedImageIndex((index) => (index - 1 + Math.max(productImages.length, 1)) % Math.max(productImages.length, 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGalleryOpen, productImages.length]);

  const showImage = useCallback((direction: -1 | 1) => {
    setSelectedImageIndex((index) => (index + direction + productImages.length) % productImages.length);
  }, [productImages.length]);

  const selectedImage = productImages[selectedImageIndex]?.image || "/noresult.png";
  const hasStock = station.status && Number(station.quantity) > 0;
  const isA628 = `${station.name} ${station.model || ""}`.toUpperCase().includes("A-628");
  const quickSpecs = [
    { label: "Чадал", value: station.power },
    { label: "Батарей", value: station.battery },
    { label: "Давтамж", value: station.hertz },
    { label: "Загвар", value: station.style },
  ].filter((spec) => typeof spec.value === "string" && spec.value.trim() && spec.value.trim() !== "-");

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  const {
    handleAddProductToCart,
    cartProducts,
  } = useCart();
  const openInquiry = useOpenMessengerInquiry();
  const existingCartProduct = cartProducts.find((item) => item._id === station._id);

  const cartProduct: Product = {
    ...station,
    images: productImages,
    quantity: 1,
  };

  return (
    <div className="mt-6 grid w-full grid-cols-1 gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
      <div className="flex w-full min-w-0 flex-col-reverse gap-3 sm:flex-row sm:gap-4 lg:h-[580px]">
        <div role="group" aria-label="Бүтээгдэхүүний бүх зураг" className="flex w-full shrink-0 flex-row gap-2 overflow-x-auto pb-1 sm:w-20 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pb-0 lg:w-24">
          {productImages.map((image, index) => (
            <div
              key={`${image.image}-${index}`}
              className={`group relative flex aspect-square h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1 transition-colors sm:h-20 sm:w-20 sm:p-1.5 lg:h-auto lg:w-full ${selectedImageIndex === index ? "border-amber-500 ring-2 ring-amber-100" : "border-slate-200 hover:border-amber-300"}`}
            >
              <ProductImage
                src={image.image}
                alt={`${station.name} зураг ${index + 1}`}
                fill
                sizes="(max-width: 640px) 64px, 88px"
                className="cursor-pointer object-contain p-1 transition-transform duration-200 group-hover:scale-105"
                onClick={() => handleImageClick(index)}
              />
              <button type="button" aria-label={`${index + 1}-р зургийг сонгох`} onClick={() => handleImageClick(index)} className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500" />
            </div>
          ))}
        </div>

        <div className="group relative flex h-[min(72vh,620px)] min-h-[340px] w-full min-w-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-3 sm:p-6 lg:h-full lg:min-h-0 lg:p-8">
          <ProductImage
            src={selectedImage}
            alt={station.name}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="cursor-zoom-in rounded-md object-contain p-2 sm:p-4"
            priority
            onClick={() => productImages.length > 0 && setIsGalleryOpen(true)}
          />
          {productImages.length > 0 && <>
            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur"><Images className="h-3.5 w-3.5" />{selectedImageIndex + 1} / {productImages.length}</span>
            <button type="button" onClick={() => setIsGalleryOpen(true)} className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-colors hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"><Maximize2 className="h-4 w-4" /><span className="hidden sm:inline">Бүх зургийг томоор харах</span><span className="sm:hidden">Томоор харах</span></button>
          </>}
        </div>
      </div>

      <div className="flex w-full min-w-0 justify-center lg:h-[580px]">
        <div className="flex flex-col space-y-2 w-full justify-between h-full">
          <ScrollArea className="w-full h-auto lg:h-full lg:overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <h1 className="min-w-0 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                {station.name}
              </h1>
              <div className="flex shrink-0 items-center gap-2">
                {Number(station.rating) > 0 && <><Rating value={station.rating} precision={0.5} readOnly /><span className="text-sm text-gray">({station.rating})</span></>}
                <ShareProductButton
                  title={`${station.name} | ${station.brand}`}
                  description={String(station.description || `${station.brand} ${station.name} холбооны станц.`)}
                  url={canonicalUrl}
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                {formatPrice(station.priceN)}₮
                </span>
                <span className="pb-1 text-sm text-slate-400">НӨАТ багтсан</span>
              </div>
              {hasStock && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  Бэлэн байгаа
                </span>
              )}
            </div>
            {quickSpecs.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {quickSpecs.map((spec) => (
                  <div key={spec.label} className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                    <span className="block text-[11px] font-medium text-slate-500">{spec.label}</span>
                    <span className="mt-1 block truncate text-sm font-semibold text-slate-800" title={spec.value}>{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {isA628 && (
              <section className="mt-4 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5" aria-labelledby="a628-use-title">
                <h2 id="a628-use-title" className="text-sm font-semibold text-slate-900">A-628-ийг ямар ажилд сонгох вэ?</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Харуул хамгаалалт", "Барилга, талбайн баг", "Агуулах, ложистик", "Хөдөө ажиллах баг"].map((use) => (
                    <span key={use} className="rounded-full border border-amber-200/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">{use}</span>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">Холбооны бодит зай нь орчин, антенн, тохиргооноос хамаарна. Ашиглах давтамж, зөвшөөрлийн нөхцөлийг урьдчилан лавлаарай.</p>
              </section>
            )}
            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex-1 space-y-2">
                <strong>Тайлбар:</strong>
                <p className="text-sm leading-6 break-words whitespace-pre-wrap text-slate-700">
                  {station.description || "Бүтээгдэхүүний нэмэлт мэдээллийг биднээс лавлана уу."}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <strong>Батарэй:</strong>
                <p className="text-sm">{station.battery}</p>
                <BatteryIcon />
              </div>
              <div className="flex space-x-2 items-center">
                <strong>Гаралтын чадал:</strong>
                <p className="text-sm">{station.power}</p>
              </div>
              <div className="flex space-x-2 items-center">
                <strong>Давтамж:</strong>
                <p className="text-sm ">{station.hertz}</p>
              </div>
              <div className="flex space-x-2 items-center">
                <strong>Загвар:</strong>
                <p className="text-sm ">{station.style}</p>
              </div>
            </div>
          </ScrollArea>
          <Separator />
          <div className="flex w-full">
            <Button
              type="button"
              className="flex min-h-12 w-full items-center rounded-xl bg-[#ffac04] px-6 py-3 font-semibold text-slate-950 shadow-sm transition-colors hover:bg-[#f6a400] focus-visible:ring-amber-600"
              onClick={() => {
                if (!existingCartProduct) handleAddProductToCart(cartProduct);
                openInquiry();
              }}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{existingCartProduct ? "Сонголтоо харах" : "Үнийн лавлагаа авах"}</span>
            </Button>
          </div>
        </div>
      </div>

      {isGalleryOpen && productImages.length > 0 && <div role="dialog" aria-modal="true" aria-label={`${station.name} зургийн цомог`} className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 p-3 text-white backdrop-blur-sm sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsGalleryOpen(false); }}>
        <div className="flex shrink-0 items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium sm:text-base">{station.name}</p><p className="mt-0.5 text-xs text-white/60">{selectedImageIndex + 1} / {productImages.length} зураг · суман товчлуураар шилжүүлнэ</p></div><button type="button" onClick={() => setIsGalleryOpen(false)} aria-label="Зургийн цомог хаах" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><X className="h-5 w-5" /></button></div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center py-3 sm:py-5">
          <div className="relative h-full w-full"><ProductImage src={selectedImage} alt={`${station.name} зураг ${selectedImageIndex + 1}`} fill sizes="100vw" className="object-contain" priority /></div>
          {productImages.length > 1 && <><button type="button" onClick={() => showImage(-1)} aria-label="Өмнөх зураг" className="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4 sm:h-12 sm:w-12"><ChevronLeft className="h-6 w-6" /></button><button type="button" onClick={() => showImage(1)} aria-label="Дараагийн зураг" className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4 sm:h-12 sm:w-12"><ChevronRight className="h-6 w-6" /></button></>}
        </div>
        <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-white/10 py-3">{productImages.map((image, index) => <button type="button" key={`${image.image}-lightbox-${index}`} onClick={() => setSelectedImageIndex(index)} aria-label={`${index + 1}-р зургийг үзэх`} aria-current={selectedImageIndex === index} className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-white/5 sm:h-16 sm:w-16 ${selectedImageIndex === index ? "border-amber-400 ring-2 ring-amber-400/40" : "border-white/20 opacity-70 hover:opacity-100"}`}><ProductImage src={image.image} alt="" fill sizes="64px" className="object-contain p-1" /></button>)}</div>
      </div>}
    </div>
  );
};

export default StationCard;
