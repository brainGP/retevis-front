"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes, CircleAlert, PackageCheck, RefreshCw, Search, X } from "lucide-react";
import { isAdmin } from "@/lib/authHelper";
import { Product } from "@/types/Product";
import ProductTable from "@/components/Products/ProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { notifyCatalogChanged } from "@/lib/catalogCache";
import { deleteProductById, getProducts, updateProductStock } from "@/apis/products";
import ConfirmationDialog from "./components/confirmation";
import AddProduct from "./components/addProduct";

const categories = ["Бүгд", "Гар станц", "Суурин станц", "Дагалдах хэрэгслүүд", "Бусад бараа"];

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Бүгд");
  const [loadError, setLoadError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Бүтээгдэхүүн татаж чадсангүй.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void isAdmin().then((allowed) => {
      if (!active) return;
      if (!allowed) {
        toast.error("Админ эрхээр нэвтэрч орно уу.");
        router.replace("/");
        return;
      }
      setAuthorized(true);
      void fetchProducts();
    });
    return () => { active = false; };
  }, [router, fetchProducts]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "Бүгд" || product.sort === category;
      const searchable = [product.name, product.brand, product.model, product.type, product.style, product.description].filter(Boolean).join(" ").toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [products, query, category]);

  const handleDelete = async () => {
    if (!productToDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteProductById({ id: productToDelete });
      setProducts((current) => current.filter((product) => product._id !== productToDelete));
      notifyCatalogChanged();
      toast.success("Бүтээгдэхүүнийг амжилттай устгалаа.");
      setIsDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Бүтээгдэхүүнийг устгаж чадсангүй.");
    } finally {
      setDeleting(false);
    }
  };

  const handleStockUpdate = async (product: Product, changes: { quantity?: number; status?: boolean }) => {
    if (updatingStockId) return;
    setUpdatingStockId(product._id);
    try {
      const updated = await updateProductStock({ id: product._id, ...changes });
      setProducts((current) => current.map((item) => item._id === product._id ? { ...item, ...updated, ...changes } : item));
      notifyCatalogChanged();
      toast.success(changes.quantity !== undefined ? "Үлдэгдэл шинэчлэгдлээ." : "Харагдах төлөв шинэчлэгдлээ.");
    } catch (error) {
      throw error instanceof Error ? error : new Error("Өөрчлөлтийг хадгалж чадсангүй.");
    } finally {
      setUpdatingStockId(null);
    }
  };

  if (!authorized) return <div className="h-48 animate-pulse rounded-2xl bg-slate-100" aria-label="Админ эрх шалгаж байна" />;

  const activeCount = products.filter((product) => (product.status === true || String(product.status).toLowerCase() === "true") && Number(product.quantity) > 0).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><div className="flex items-center gap-2"><Boxes className="h-5 w-5 text-amber-700" /><h2 className="text-lg font-semibold text-slate-900">Бүтээгдэхүүний каталог</h2></div><p className="mt-1 text-sm text-slate-500">Каталогийн мэдээлэл, үнэ, үлдэгдэл болон зургаа нэг дор удирдана.</p></div>
        <AddProduct setProducts={setProducts} editProduct={editProduct} setEditProduct={setEditProduct} />
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700"><Boxes className="h-5 w-5" /></span><div><p className="text-xs font-medium text-slate-500">Нийт бүтээгдэхүүн</p><p className="text-xl font-semibold tabular-nums text-slate-900">{loading ? "—" : products.length.toLocaleString("mn-MN")}</p></div></div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-700"><PackageCheck className="h-5 w-5" /></span><div><p className="text-xs font-medium text-slate-500">Идэвхтэй, үлдэгдэлтэй</p><p className="text-xl font-semibold tabular-nums text-slate-900">{loading ? "—" : activeCount.toLocaleString("mn-MN")}</p></div></div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div><h3 className="font-semibold text-slate-900">Бүх бүтээгдэхүүн</h3><p className="mt-1 text-sm text-slate-500">{loading ? "Мэдээлэл татаж байна…" : `${visibleProducts.length} бүтээгдэхүүн харагдаж байна`}</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 sm:w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Нэр, брэнд, загвар хайх" aria-label="Бүтээгдэхүүн хайх" className="h-10 rounded-lg border-slate-200 pl-9 pr-9" />{query && <button type="button" aria-label="Хайлтыг арилгах" onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>}</div>
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Ангиллаар шүүх" className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow/50">{categories.map((item) => <option key={item}>{item}</option>)}</select>
            <Button variant="outline" onClick={() => void fetchProducts()} disabled={loading} className="h-10"><RefreshCw className={loading ? "animate-spin" : ""} />Шинэчлэх</Button>
          </div>
        </div>
        {loadError ? <div className="flex flex-col items-center gap-3 px-4 py-12 text-center"><CircleAlert className="h-8 w-8 text-amber-700" /><p className="max-w-md text-sm text-slate-600">{loadError}</p><Button variant="outline" onClick={() => void fetchProducts()}><RefreshCw />Дахин оролдох</Button></div> : loading ? <div className="space-y-3 p-5" aria-label="Бүтээгдэхүүн татаж байна">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-100" />)}</div> : <ProductTable products={visibleProducts} onEdit={setEditProduct} onDelete={(id) => { setProductToDelete(id); setIsDialogOpen(true); }} onStockUpdate={handleStockUpdate} updatingStockId={updatingStockId} />}
      </section>

      <ConfirmationDialog isOpen={isDialogOpen} setIsOpen={(open) => { if (!deleting) setIsDialogOpen(open); }} title="Бүтээгдэхүүн устгах" description="Энэ үйлдлийг буцаах боломжгүй. Устгахдаа итгэлтэй байна уу?" callback={handleDelete} actionLabel={deleting ? "Устгаж байна…" : "Устгах"} />
    </div>
  );
}
