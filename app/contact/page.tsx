"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LoadingError } from "@/components/LoadingError";

const Home = () => {
  const [isMapInView, setIsMapInView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsMapInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const mapSection = document.getElementById("map-section");
    if (mapSection) observer.observe(mapSection);

    return () => {
      if (mapSection) observer.unobserve(mapSection);
    };
  }, []);

  const handleError = () => {
    setLoading(false);
  };

  return (
    <div className="site-container flex flex-col gap-12 py-8 sm:gap-16 sm:py-10">
      <div id="map-section" className="flex flex-col gap-4">
        <h1 className="font-medium text-xl md:text-2xl">Газрын зураг</h1>
        <div className="relative flex min-h-[280px] justify-center sm:min-h-[380px]">
          <LoadingError isLoading={loading} />
          {isMapInView && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.659448480662!2d106.90872647687203!3d47.90427637121876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9693fe320bd967%3A0xbbac0999ded34b5!2zUmV0ZXZpcyBNb25nb2xpYS8g0KDQsNC00LjQviDRgdGC0LDQvdGG!5e0!3m2!1sen!2smn!4v1732851245626!5m2!1sen!2smn"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full min-h-[280px] w-full rounded-xl border border-slate-200 shadow-sm sm:min-h-[380px]"
              onLoad={() => setLoading(false)}
              onError={handleError}
            />
          )}
        </div>
        <div className="flex justify-end flex-row gap-4">
          <span className="text-gray/40">Google maps: </span>
          <Image
            src="/Retevis/RetevisMongolia.svg"
            alt="logo"
            height={10}
            width={120}
            priority={true}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-medium text-xl md:text-2xl">Сошиал хуудсууд</h1>
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-6">
          <a
            href="https://www.facebook.com/RetevisMongolia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Retevis Mongolia Facebook хуудсыг нээх"
            className="group block w-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[5/2] w-full bg-slate-50">
              <Image
                src="/fbpost.png"
                alt="Retevis Mongolia-ийн Facebook хуудасны зураг"
                fill
                sizes="(max-width: 639px) 100vw, 50vw"
                className="object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                priority
              />
            </div>
            <span className="flex min-h-11 items-center justify-between border-t border-slate-100 px-4 text-sm font-medium text-slate-700">
              Facebook хуудсыг нээх <span aria-hidden="true">↗</span>
            </span>
          </a>
          <a
            href="https://www.instagram.com/retevis_mongolia/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Retevis Mongolia Instagram хуудсыг нээх"
            className="group block w-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            <div className="relative aspect-[5/2] w-full bg-slate-50">
              <Image
                src="/igpost.png"
                alt="Retevis Mongolia-ийн Instagram хуудасны зураг"
                fill
                sizes="(max-width: 639px) 100vw, 50vw"
                className="object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              />
            </div>
            <span className="flex min-h-11 items-center justify-between border-t border-slate-100 px-4 text-sm font-medium text-slate-700">
              Instagram хуудсыг нээх <span aria-hidden="true">↗</span>
            </span>
          </a>
        </div>
        <div className="flex justify-end flex-row gap-4">
          <span className="text-gray/40">Facebook, Instagram: </span>
          <Image
            src="/Retevis/RetevisMongolia.svg"
            alt="logo"
            height={10}
            width={120}
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
