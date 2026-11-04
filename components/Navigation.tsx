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
    { href: "/", label: "Нүүр", icon: <Home size={21} />, aria: "Home page" },
    {
      href: "/stations",
      label: "Станц",
      icon: <Smartphone size={21} />,
      aria: "Stations page",
    },
    {
      href: "/other",
      label: "Бусад бараа",
      icon: <Package size={21} />,
      aria: "Other products page",
    },
    {
      href: "/contact",
      label: "Холбоо барих",
      icon: <MessageCircleQuestionIcon size={21} />,
      aria: "Contact page",
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

      {/* Mobile view */}
      <div className="w-full flex md:hidden min-h-[68px] border-t border-slate-200/80 bg-white/95 backdrop-blur-xl items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            aria-label={item.aria}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={classNames("flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-medium transition-colors", isActive(item.href) ? "text-amber-700" : "text-slate-500 hover:text-slate-900")}
          >
            <span className={classNames("flex h-8 w-10 items-center justify-center rounded-xl transition-colors", isActive(item.href) ? "bg-amber-50" : "")}>{item.icon}</span>
            <span className="leading-none">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
