"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Search from "./Search";
import Navigation from "./Navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Profile } from "./SkeletonDemo";
import ShopCard from "./ShopCart";
import { ChevronUp } from "lucide-react";

const Header: React.FC = () => {
  const [visibleHeader, setVisibleHeader] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);
  useEffect(() => {
    let frameId: number | null = null;
    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setVisibleHeader(currentScrollY < 50);
        setShowScrollTopBtn(currentScrollY > 200);
        frameId = null;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const originalHeight = window.innerHeight;
    const threshold = 150;

    const handleResize = () => {
      const heightDiff = originalHeight - window.innerHeight;
      const isKeyboardNowOpen = heightDiff > threshold;

      if (isKeyboardNowOpen) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className={cn(
          "sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-transform duration-200 ease-out md:hidden",
          visibleHeader ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex w-full flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/Retevis/retevis.png"
                alt="Retevis Logo"
                width={120}
                height={60}
                className="object-contain"
                priority
              />
            </Link>
            <div className="flex items-center gap-3 p-1">
              <ShopCard />
              <Profile />
            </div>
          </div>
          <Search />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="sticky top-0 z-30 hidden w-full md:block">
        <div
          className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
            visibleHeader ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
          )}
          aria-hidden={!visibleHeader}
        >
          <div className={cn(
            "min-h-0 overflow-hidden bg-white/95 shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl",
            visibleHeader && "border-b border-slate-200/80"
          )}>
            <div className="site-container flex items-center justify-between gap-4">
              <div className="w-full py-3">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex-shrink-0">
                    <Image
                      src="/Retevis/retevis.png"
                      alt="Retevis Logo"
                      width={160}
                      height={80}
                      className="object-contain"
                      priority
                    />
                  </Link>

                  <div className="w-full max-w-md flex-1 md:max-w-lg">
                    <Search />
                  </div>

                  <div className="flex items-center gap-8">
                    <ShopCard />
                    <Profile />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_2px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <div className="site-container py-1.5">
            <Navigation />
          </div>
        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed bottom-0 left-0 w-full z-30 border-t bg-white shadow-md transition-transform duration-200 ease-out",
          showBottomNav ? "translate-y-0" : "translate-y-full"
        )}
      >
        <Navigation />
      </div>

      {/* Scroll To Top Button */}
      {showScrollTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-20 right-5 z-40 p-3 rounded-full bg-yellow/80 shadow-lg hover:bg-yellow transition"
        >
          <ChevronUp className="text-white" size={24} />
        </button>
      )}
    </>
  );
};

export default Header;
