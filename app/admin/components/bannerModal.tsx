"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Banner } from "@/types/Banner";
import { compressImage } from "@/lib/compressImage";
import { ImagePlus, LoaderCircle, Upload, X } from "lucide-react";

interface BannerModalProps {
  banner: Banner | null;
  onClose: () => void;
  onSave: (newBanner: Banner, files: File[]) => Promise<void>;
}

const BannerModal: React.FC<BannerModalProps> = ({ banner, onClose, onSave }) => {
  const [formData, setFormData] = useState<Banner>({ _id: banner?._id || "", image: banner?.image || "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef(onClose);
  const busyRef = useRef(false);
  const previewRef = useRef("");
  closeRef.current = onClose;
  busyRef.current = isCompressing || isSaving;

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyRef.current) closeRef.current();
    };
    window.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", keydown);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const chooseFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(selected.type)) {
      toast.error("Зургийн файл сонгоно уу.");
      return;
    }
    if (selected.size > 25 * 1024 * 1024) {
      toast.error("Эх зураг 25MB-аас бага байх шаардлагатай.");
      return;
    }
    setIsCompressing(true);
    try {
      const compressed = await compressImage(selected);
      if (compressed.size > 5 * 1024 * 1024) {
        toast.error("Боловсруулсан зураг 5MB-аас их байна. Жижиг зураг сонгоно уу.");
        return;
      }
      const nextPreview = URL.createObjectURL(compressed);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = nextPreview;
      setFile(compressed);
      setPreview(nextPreview);
      setFormData((current) => ({ ...current, image: nextPreview }));
    } catch {
      toast.error("Зургийг уншихад алдаа гарлаа. Өөр зураг сонгоно уу.");
    } finally {
      setIsCompressing(false);
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || isSaving || isCompressing) {
      if (!file) toast.error("Баннерын зураг сонгоно уу.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData, [file]);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Баннер хадгалж чадсангүй. Дахин оролдоно уу.");
    } finally {
      setIsSaving(false);
    }
  };

  const busy = isCompressing || isSaving;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="banner-modal-title" className="w-full max-w-xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><ImagePlus className="h-5 w-5" /></span><div><h2 id="banner-modal-title" className="text-lg font-semibold text-slate-900">{banner?._id ? "Баннерын зураг солих" : "Шинэ баннер нэмэх"}</h2><p className="mt-0.5 text-sm text-slate-500">{banner?._id ? "Шинэ зураг хадгалахад одоогийн зураг солигдоно." : "Дэлгүүрт харуулах баннерын зургаа оруулна уу."}</p></div></div>
          <button type="button" aria-label="Хаах" disabled={busy} onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </header>
        <form onSubmit={save}>
          <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={chooseFile} className="sr-only" aria-label="Баннерын зураг сонгох" />
            {preview || (banner?._id && banner.image) ? (
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="relative aspect-[16/7] w-full"><Image src={preview || banner!.image} alt="Баннерын урьдчилсан харагдац" fill unoptimized className="object-contain" /></div>
                <div className="flex items-center justify-between border-t border-slate-200 bg-white px-3 py-2.5"><span className="truncate pr-3 text-sm text-slate-600">{file?.name || "Одоогийн зураг"}</span><Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}><ImagePlus />Зураг солих</Button></div>
              </div>
            ) : (
              <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="flex min-h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-amber-500 hover:bg-amber-50/50 disabled:opacity-50"><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">{isCompressing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}</span><span className="text-sm font-semibold text-slate-900">{isCompressing ? "Зургийг бэлдэж байна…" : "Зураг сонгох"}</span><span className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, GIF эсвэл AVIF · Cloudinary руу 5MB хүртэл</span></button>
            )}
            {preview && <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline">Өөр зураг сонгох</button>}
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">Зургийн файлыг хадгалахаас өмнө боломжтой үед WebP болгон шахна. Баннерын дүрсийг утас болон компьютер дээр шалгаарай.</p>
          </div>
          <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"><Button type="button" variant="outline" onClick={onClose} disabled={busy} className="sm:min-w-28">Болих</Button><Button type="submit" disabled={!file || busy} className="sm:min-w-36">{busy ? <><LoaderCircle className="animate-spin" />{isCompressing ? "Боловсруулж байна" : "Хадгалж байна"}</> : <><ImagePlus />{banner?._id ? "Зураг солих" : "Баннер хадгалах"}</>}</Button></footer>
        </form>
      </section>
    </div>
  );
};

export default BannerModal;
