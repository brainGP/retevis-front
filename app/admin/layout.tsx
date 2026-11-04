import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNavigation from "@/components/Admin/AdminNavigation";

export const metadata: Metadata = {
  title: "Retevis",
  description: "Retevis Mongolia",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main className="site-container min-h-[65vh] py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Retevis Mongolia</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Админ удирдлага</h1>
            <p className="mt-1 text-sm text-slate-500">Каталог, баннер болон хэрэглэгчийн мэдээллээ удирдах.</p>
          </div>
          <AdminNavigation />
        </div>
        {children}
      </main>

      <Footer />
    </>
  );
}
