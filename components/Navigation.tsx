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
    { href: "/", label: "Нүүр", icon: <Home size={24} />, aria: "Home page" },
    {
      href: "/stations",
      label: "Станц",
      icon: <Smartphone size={24} />,
      aria: "Stations page",
    },
    {
      href: "/other",
      label: "Бусад бараа",
      icon: <Package size={24} />,
      aria: "Other products page",
    },
    {
      href: "/contact",
      label: "Холбоо барих",
      icon: <MessageCircleQuestionIcon size={24} />,
      aria: "Contact page",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="flex gap-8 text-sm justify-center items-center flex-wrap">
      {/* Desktop view */}
      <div className="hidden md:flex gap-8">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={classNames(
              "flex items-center gap-1 group",
              isActive(item.href)
                ? "text-yellow font-medium underline underline-offset-1"
                : "text-gray hover:text-yellow cursor-pointer"
            )}
          >
            <Link href={item.href}>{item.label}</Link>
          </div>
        ))}
      </div>

      {/* Mobile view */}
      <div className="w-full flex md:hidden h-[60px] bg-white border-t items-center justify-between px-8">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            aria-label={item.aria}
            className={classNames(
              "flex items-center justify-center gap-2 py-4 px-2",
              isActive(item.href)
                ? "text-yellow"
                : "text-gray hover:text-yellow"
            )}
          >
            {item.icon}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
