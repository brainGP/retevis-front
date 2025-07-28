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
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowBottomNav(false);
      } else {
        setShowBottomNav(true);
      }

      setVisibleHeader(currentScrollY < 50);

      setShowScrollTopBtn(currentScrollY > 200);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
          "sticky top-0 z-30 w-full bg-white opacity-95 border-b transition-transform duration-300 ease-in-out md:hidden",
          visibleHeader ? "translate-y-0" : "-translate-y-[56px]"
        )}
      >
        <div className="px-8 py-6 pb-2 flex flex-col gap-2 w-full">
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
            <div className="flex items-center gap-6 p-2">
              <ShopCard />
              <Profile />
            </div>
          </div>
          <Search />
        </div>
      </div>

      {/* Desktop Header */}
      <div
        className={cn(
          "sticky top-0 z-30 w-full bg-white bg-opacity-95 border-b transition-transform duration-300 ease-in-out hidden md:block",
          visibleHeader ? "translate-y-0" : "-translate-y-[86px]"
        )}
      >
        <div className="container flex items-center justify-between mx-auto gap-4">
          <div className="w-full py-4">
            <div className="flex justify-between items-center">
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

              <div className="w-full flex-1 max-w-md md:max-w-lg">
                <Search />
              </div>

              <div className="flex items-center gap-12 md:gap-8">
                <ShopCard />
                <Profile />
              </div>
            </div>
            <div className="w-full h-[1px] bg-neutral-200 my-4" />
            <Navigation />
          </div>
        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed bottom-0 left-0 w-full z-30 border-t bg-white shadow-md transition-transform duration-300",
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
