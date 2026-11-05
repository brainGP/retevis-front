"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Smartphone,
  MessageCircleQuestionIcon,
} from "lucide-react";

const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Нүүр", icon: <Home size={21} />, aria: "Нүүр хуудас" },
    {
      href: "/stations",
      label: "Станц",
      icon: <Smartphone size={21} />,
      aria: "Станцын бараа",
    },
    {
      href: "/other",
      label: "Бусад бараа",
      icon: <Package size={21} />,
      aria: "Бусад бараа",
    },
    {
      href: "/contact",
      label: "Холбоо барих",
      icon: <MessageCircleQuestionIcon size={21} />,
      aria: "Холбоо барих",
    },
  ];

  const isActive = (href: string) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Үндсэн цэс" className="flex flex-wrap items-center justify-center gap-8 text-sm">
      {/* Desktop view */}
      <div className="hidden md:flex gap-8">
        {navItems.map((item, index) => (
          <div
            key={index}
            className="group"
          >
            <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={classNames(
              "relative inline-flex items-center py-2 font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:rounded-full after:bg-yellow after:transition-transform",
              isActive(item.href) ? "text-slate-950 after:scale-x-100" : "text-slate-600 after:scale-x-0 hover:text-slate-950 group-hover:after:scale-x-100"
            )}>{item.label}</Link>
          </div>
        ))}
      </div>

      {/* Floating liquid-glass dock for mobile */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 px-3 md:hidden">
        <div className="pointer-events-auto relative mx-auto flex min-h-[4.25rem] w-full max-w-[27rem] items-center justify-around gap-1 overflow-hidden rounded-[1.8rem] border border-white/80 bg-gradient-to-br from-white/75 via-white/45 to-amber-100/35 px-2 py-1.5 shadow-[0_12px_36px_rgba(15,23,42,0.2),inset_0_1.5px_1px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(255,255,255,0.5)] backdrop-blur-2xl backdrop-saturate-150 before:pointer-events-none before:absolute before:inset-x-5 before:top-px before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:content-['']">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            aria-label={item.aria}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={classNames("group relative z-10 flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1 text-[9px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white/60", isActive(item.href) ? "text-amber-800" : "text-slate-600 hover:text-slate-950 active:scale-95")}
          >
            <span className={classNames("flex h-7 w-10 items-center justify-center rounded-xl transition-all duration-200", isActive(item.href) ? "bg-white/70 shadow-[0_2px_10px_rgba(245,158,11,0.16),inset_0_1px_1px_rgba(255,255,255,0.95)]" : "group-hover:bg-white/45")}>
              {React.cloneElement(item.icon, {
                size: 20,
                strokeWidth: isActive(item.href) ? 2.25 : 1.8,
                className: classNames("transition-all duration-200", isActive(item.href) ? "drop-shadow-[0_0_7px_rgba(245,158,11,0.45)]" : ""),
                "aria-hidden": true,
              })}
            </span>
            <span className="whitespace-nowrap leading-none">{item.label}</span>
          </Link>
        ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
