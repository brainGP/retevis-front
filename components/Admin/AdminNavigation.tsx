"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ImageIcon, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { href: "/admin", label: "Бүтээгдэхүүн", icon: Boxes, exact: true },
  { href: "/admin/banner", label: "Баннер", icon: ImageIcon },
  { href: "/admin/users", label: "Хэрэглэгчид", icon: Users },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Админ хэсгийн цэс" className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
      {sections.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/60 sm:px-4",
              active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
