"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Search from "./Search";
import Navigation from "./Navigation";
import { Profile } from "./SkeletonDemo";
import ShopCard from "./ShopCart";
import { ChevronUp } from "lucide-react";

const Header: React.FC = () => {
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;
    let previousVisibility = false;

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 240;
        if (shouldShow !== previousVisibility) {
          previousVisibility = shouldShow;
          setShowScrollTopBtn(shouldShow);
        }
        frameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* This top row scrolls naturally; it no longer changes the sticky row's height. */}
      <div className="w-full border-b border-slate-200/80 bg-white/95 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="site-container grid w-full grid-cols-[1fr_auto] gap-3 py-3 md:flex md:items-center md:justify-between md:gap-4">
          <Link href="/" className="col-start-1 row-start-1 shrink-0 md:order-1" aria-label="Retevis нүүр хуудас">
            <Image
              src="/Retevis/retevis.png"
              alt="Retevis Mongolia"
              width={160}
              height={80}
              className="h-auto w-[120px] object-contain md:w-[160px]"
              priority
            />
          </Link>

          <div className="col-span-2 row-start-2 w-full md:order-2 md:block md:max-w-lg md:flex-1">
            <Search />
          </div>

          <div className="col-start-2 row-start-1 flex shrink-0 items-center gap-3 p-1 md:order-3 md:gap-8">
            <ShopCard />
            <Profile />
          </div>
        </div>
      </div>

      {/* Desktop navigation stays at the top; mobile navigation floats above the safe area. */}
      <div className="sticky top-0 z-30 hidden w-full border-b border-slate-200/80 bg-white/95 shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl md:block">
        <div className="site-container py-1.5">
          <Navigation />
        </div>
      </div>
      <div className="md:hidden"><Navigation /></div>

      {showScrollTopBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Хуудасны эхлэл рүү очих"
          className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-yellow/90 text-white shadow-lg transition-colors hover:bg-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 md:bottom-5 md:right-5"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default Header;
