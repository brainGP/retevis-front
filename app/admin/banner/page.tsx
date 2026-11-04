"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon, ImagePlus, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { getBanners } from "@/apis/banner";
import { DELETE } from "@/apis/axios";
import { isAdmin } from "@/lib/authHelper";
import { notifyCatalogChanged } from "@/lib/catalogCache";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Banner } from "@/types/Banner";
import BannerModal from "../components/bannerModal";
import ConfirmationDialog from "../components/confirmation";
import { uploadNewBanner, uploadUpdatedBanner } from "@/apis/uploads";

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setBanners(await getBanners());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Баннер татаж чадсангүй.";
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
      setIsAuthorized(true);
      void fetchBanners();
    });
    return () => { active = false; };
  }, [router, fetchBanners]);

  const saveBanner = async (newBanner: Banner, files: File[]) => {
    if (!files[0]) throw new Error("Баннерын зураг сонгоно уу.");
    try {
      const banner = newBanner._id
        ? await uploadUpdatedBanner(newBanner._id, files[0])
        : await uploadNewBanner(files[0]);
      setBanners((current) => newBanner._id
        ? current.map((item) => item._id === banner._id ? banner : item)
        : [banner, ...current]);
      toast.success(newBanner._id ? "Баннерын зураг шинэчлэгдлээ." : "Баннер амжилттай нэмэгдлээ.");
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Баннер хадгалж чадсангүй.");
    }
  };

  const deleteBanner = async () => {
    if (!bannerToDelete || deleting) return;
    setDeleting(true);
    try {
      await DELETE({ route: `/api/dashboard/${encodeURIComponent(bannerToDelete)}` });
      setBanners((current) => current.filter((banner) => banner._id !== bannerToDelete));
      notifyCatalogChanged("banners");
      toast.success("Баннер амжилттай устгалаа.");
      setIsDialogOpen(false);
      setBannerToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Баннер устгаж чадсангүй.");
    } finally {
      setDeleting(false);
    }
  };

  if (!isAuthorized) return <div className="h-48 animate-pulse rounded-2xl bg-slate-100" aria-label="Админ эрх шалгаж байна" />;

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><ImageIcon className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-slate-900">Нүүр хуудасны баннер</h2><p className="mt-1 max-w-xl text-sm text-slate-500">Дэлгүүрийн нүүр хэсэгт харагдах баннерын зургийг эндээс шинэчилнэ.</p></div></div>
        <Button onClick={() => { setEditingBanner(null); setIsModalOpen(true); }} className="w-full sm:w-auto"><ImagePlus />Баннер нэмэх</Button>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><h3 className="font-semibold text-slate-900">Бүх баннер</h3><p className="mt-1 text-sm text-slate-500">{loading ? "Мэдээлэл татаж байна…" : `${banners.length} баннер`}</p></div><Button variant="outline" onClick={() => void fetchBanners()} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} />Шинэчлэх</Button></div>
        {loadError ? <div className="flex flex-col items-center gap-3 px-4 py-12 text-center"><p className="text-sm text-slate-600">{loadError}</p><Button variant="outline" onClick={() => void fetchBanners()}><RefreshCw />Дахин оролдох</Button></div> : loading ? <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="aspect-[16/8] animate-pulse rounded-xl bg-slate-100" />)}</div> : banners.length ? <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">{banners.map((banner, index) => <article key={banner._id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="relative aspect-[16/8] bg-slate-50"><Image src={banner.image} alt={`Нүүр хуудасны баннер ${index + 1}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-contain" /></div><div className="flex items-center justify-between gap-3 border-t border-slate-100 px-3 py-3"><div className="min-w-0"><p className="text-sm font-medium text-slate-800">Баннер {index + 1}</p><p className="truncate text-xs text-slate-500">Нүүр хуудасны зураг</p></div><div className="flex shrink-0 gap-2"><Button type="button" variant="outline" size="sm" aria-label={`Баннер ${index + 1} засах`} onClick={() => { setEditingBanner(banner); setIsModalOpen(true); }}><Pencil />Засах</Button><Button type="button" variant="outline" size="sm" aria-label={`Баннер ${index + 1} устгах`} className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => { setBannerToDelete(banner._id); setIsDialogOpen(true); }}><Trash2 />Устгах</Button></div></div></article>)}</div> : <div className="flex flex-col items-center px-5 py-14 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500"><ImageIcon className="h-5 w-5" /></span><h3 className="mt-3 font-semibold text-slate-900">Одоогоор баннер алга</h3><p className="mt-1 max-w-sm text-sm text-slate-500">Нүүр хуудсанд харуулах эхний баннераа нэмж эхлээрэй.</p><Button className="mt-4" onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}><ImagePlus />Баннер нэмэх</Button></div>}
      </section>

      {isModalOpen && <BannerModal banner={editingBanner} onClose={() => { setIsModalOpen(false); setEditingBanner(null); }} onSave={saveBanner} />}
      <ConfirmationDialog isOpen={isDialogOpen} setIsOpen={(open) => { if (!deleting) setIsDialogOpen(open); }} title="Баннер устгах" description="Энэ баннерыг нүүр хуудаснаас устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй." callback={deleteBanner} actionLabel={deleting ? "Устгаж байна…" : "Устгах"} />
    </div>
  );
}
