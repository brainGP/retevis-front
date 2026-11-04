"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Product } from "@/types/Product";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { compressImage } from "@/lib/compressImage";
import { Check, ImagePlus, LoaderCircle, Package2, Radio, X } from "lucide-react";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updatedProduct: Product, files: File[]) => Promise<void>;
}

const fieldClass = "h-10 rounded-lg border-slate-200 bg-white focus-visible:ring-yellow/50";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product>(() => ({
    ...product,
    name: product.name || "", model: product.model || "", brand: product.brand || "",
    type: product.type || "", style: product.style || "", price: product.price ?? 0,
    priceN: product.priceN ?? 0, description: product.description || "", battery: product.battery || "",
    power: product.power || "", hertz: product.hertz || "", status: product.status ?? false,
    size: product.size || "", images: product.images || [], quantity: product.quantity ?? 0,
    sort: product.sort || "", rating: product.rating ?? 5,
  }));
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ preview: string; file: File }>>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewUrls = useRef(new Set<string>());
  const closeRef = useRef(onClose);
  const busyRef = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(product._id);

  closeRef.current = onClose;
  busyRef.current = isSaving || isCompressing;

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const urlsToRevoke = previewUrls.current;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busyRef.current) closeRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
      urlsToRevoke.clear();
    };
  }, []);

  const setField = <K extends keyof Product>(field: K, value: Product[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selected.length) return;
    if (uploadedFiles.length + selected.length > 8 || formData.images.length + selected.length > 12) {
      toast.error("Нийт 12 хүртэл зураг, нэг удаад 8 хүртэл зураг нэмнэ үү.");
      return;
    }
    if (selected.some((file) => file.size > 25 * 1024 * 1024)) {
      toast.error("Эх зураг 25MB-аас бага байх шаардлагатай.");
      return;
    }
    setIsCompressing(true);
    try {
      const additions: Array<{ preview: string; file: File }> = [];
      for (const original of selected) {
        const file = await compressImage(original);
        if (file.size > 5 * 1024 * 1024) {
          additions.forEach(({ preview }) => URL.revokeObjectURL(preview));
          toast.error(`${original.name} зураг 5MB-аас их байна. Жижигрүүлж дахин сонгоно уу.`);
          return;
        }
        const preview = URL.createObjectURL(file);
        previewUrls.current.add(preview);
        additions.push({ preview, file });
      }
      setUploadedFiles((current) => [...current, ...additions]);
      setFormData((current) => ({ ...current, images: [...current.images, ...additions.map(({ preview }) => ({ image: preview }))] }));
    } catch {
      toast.error("Зургийг боловсруулахад алдаа гарлаа.");
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = (index: number) => {
    const image = formData.images[index];
    if (image?.image.startsWith("blob:")) {
      URL.revokeObjectURL(image.image);
      previewUrls.current.delete(image.image);
      setUploadedFiles((current) => current.filter(({ preview }) => preview !== image.image));
    }
    setFormData((current) => ({ ...current, images: current.images.filter((_, i) => i !== index) }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving || isCompressing) return;
    if (!formData.images.length) {
      toast.error("Бүтээгдэхүүнд дор хаяж нэг зураг нэмнэ үү.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(formData, uploadedFiles.map(({ file }) => file));
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хадгалах явцад алдаа гарлаа. Мэдээллээ шалгаад дахин оролдоно уу.");
    } finally {
      setIsSaving(false);
    }
  };

  const busy = isSaving || isCompressing;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><Package2 className="h-5 w-5" /></span>
            <div>
              <h2 id="product-modal-title" className="text-lg font-semibold text-slate-900 sm:text-xl">{isEditing ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн"}</h2>
              <p className="mt-0.5 text-sm text-slate-500">Үндсэн мэдээлэл, үнэ болон зургийг бөглөнө үү.</p>
            </div>
          </div>
          <button type="button" aria-label="Хаах" disabled={busy} onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </header>

        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-6">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><Radio className="h-4 w-4 text-amber-700" /><h3 className="text-sm font-semibold text-slate-900">Бүтээгдэхүүний мэдээлэл</h3></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2"><span className={labelClass}>Нэр <span className="text-red-600">*</span></span><Input value={formData.name} onChange={(e) => setField("name", e.target.value)} maxLength={180} required className={fieldClass} placeholder="Жишээ: Retevis RT-27" /></label>
                    <label><span className={labelClass}>Брэнд <span className="text-red-600">*</span></span><Input value={formData.brand} onChange={(e) => setField("brand", e.target.value)} maxLength={80} required className={fieldClass} placeholder="Retevis" /></label>
                    <label><span className={labelClass}>Загварын дугаар</span><Input value={formData.model || ""} onChange={(e) => setField("model", e.target.value)} maxLength={120} className={fieldClass} placeholder="RT-27" /></label>
                    <label><span className={labelClass}>Ангилал <span className="text-red-600">*</span></span><select value={formData.sort} onChange={(e) => setField("sort", e.target.value)} required className={`${fieldClass} w-full px-3 text-sm`}><option value="" disabled>Ангилал сонгох</option><option>Гар станц</option><option>Суурин станц</option><option>Дагалдах хэрэгслүүд</option><option>Бусад бараа</option></select></label>
                    <label><span className={labelClass}>Төрөл <span className="text-red-600">*</span></span><Input value={formData.type} onChange={(e) => setField("type", e.target.value)} required className={fieldClass} placeholder="UHF, VHF" /></label>
                    <label><span className={labelClass}>Загварын төрөл <span className="text-red-600">*</span></span><Input value={formData.style} onChange={(e) => setField("style", e.target.value)} required className={fieldClass} placeholder="Гар станц" /></label>
                    <label><span className={labelClass}>Төлөв</span><select value={String(formData.status)} onChange={(e) => setField("status", e.target.value === "true")} className={`${fieldClass} w-full px-3 text-sm`}><option value="true">Идэвхтэй</option><option value="false">Идэвхгүй</option></select></label>
                    <label className="sm:col-span-2"><span className={labelClass}>Тайлбар <span className="text-red-600">*</span></span><Textarea value={formData.description} onChange={(e) => setField("description", e.target.value)} maxLength={10000} required rows={4} className="min-h-24 rounded-lg border-slate-200 focus-visible:ring-yellow/50" placeholder="Бүтээгдэхүүний онцлог, зориулалтыг тайлбарлана уу." /></label>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2"><span className="text-sm font-semibold text-slate-900">Үнэ ба үзүүлэлт</span></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label><span className={labelClass}>Үнэ (₮) <span className="text-red-600">*</span></span><Input type="number" min="0" step="1" value={formData.price || ""} onChange={(e) => setField("price", Number(e.target.value))} required className={fieldClass} placeholder="0" /></label>
                    <label><span className={labelClass}>НӨАТ-тай үнэ (₮) <span className="text-red-600">*</span></span><Input type="number" min="0" step="1" value={formData.priceN || ""} onChange={(e) => setField("priceN", Number(e.target.value))} required className={fieldClass} placeholder="0" /></label>
                    <label><span className={labelClass}>Үлдэгдэл <span className="text-red-600">*</span></span><Input type="number" min="0" step="1" value={formData.quantity ?? 0} onChange={(e) => setField("quantity", Number(e.target.value))} required className={fieldClass} /></label>
                    <label><span className={labelClass}>Үнэлгээ (1–5) <span className="text-red-600">*</span></span><Input type="number" min="1" max="5" step="1" value={formData.rating || 5} onChange={(e) => setField("rating", Number(e.target.value))} required className={fieldClass} /></label>
                    <label><span className={labelClass}>Батерей <span className="text-red-600">*</span></span><Input value={formData.battery} onChange={(e) => setField("battery", e.target.value)} required className={fieldClass} placeholder="Жишээ: 2000mAh" /></label>
                    <label><span className={labelClass}>Чадал <span className="text-red-600">*</span></span><Input value={formData.power} onChange={(e) => setField("power", e.target.value)} required className={fieldClass} placeholder="Жишээ: 5W" /></label>
                    <label><span className={labelClass}>Давтамж <span className="text-red-600">*</span></span><Input value={formData.hertz} onChange={(e) => setField("hertz", e.target.value)} required className={fieldClass} placeholder="Жишээ: 400–470MHz" /></label>
                    <label><span className={labelClass}>Хэмжээ</span><Input value={formData.size} onChange={(e) => setField("size", e.target.value)} className={fieldClass} placeholder="Хэмжээс" /></label>
                  </div>
                </section>
              </div>

              <aside className="space-y-3 lg:sticky lg:top-0 lg:self-start">
                <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold text-slate-900">Бүтээгдэхүүний зураг</h3><p className="mt-0.5 text-xs text-slate-500">12 хүртэл зураг · автоматаар шахна</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{formData.images.length}/12</span></div>
                <button type="button" onClick={() => fileInput.current?.click()} disabled={busy || formData.images.length >= 12} className="flex min-h-28 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-amber-500 hover:bg-amber-50/50 disabled:opacity-50"><ImagePlus className="mb-2 h-6 w-6 text-slate-500" /><span className="text-sm font-medium text-slate-800">{isCompressing ? "Зургийг боловсруулж байна…" : "Зураг сонгох"}</span><span className="mt-1 text-xs text-slate-500">JPG, PNG, WebP, GIF, AVIF · 5MB / зураг</span></button>
                <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple onChange={handleImageChange} className="sr-only" aria-label="Бүтээгдэхүүний зураг сонгох" />
                {formData.images.length ? <div className="grid grid-cols-3 gap-2">{formData.images.map((image, index) => <div key={`${image.image}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50"><Image src={image.image} alt={`Бүтээгдэхүүний зураг ${index + 1}`} fill unoptimized className="object-contain p-1" /><button type="button" onClick={() => removeImage(index)} aria-label={`${index + 1}-р зургийг устгах`} className="absolute right-1 top-1 rounded-full bg-white/95 p-1 text-slate-700 shadow transition hover:bg-red-50 hover:text-red-700"><X className="h-3.5 w-3.5" /></button>{index === 0 && <span className="absolute bottom-1 left-1 rounded bg-slate-900/75 px-1.5 py-0.5 text-[10px] font-medium text-white">Үндсэн</span>}</div>)}</div> : <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">Эхний зураг бүтээгдэхүүний үндсэн зураг болж харагдана.</p>}
              </aside>
            </div>
          </div>
          <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-between sm:px-7">
            <p className="self-center text-xs text-slate-500"><span className="text-red-600">*</span> заавал бөглөнө</p>
            <div className="flex gap-2"><Button type="button" variant="outline" disabled={busy} onClick={onClose} className="flex-1 sm:flex-none">Болих</Button><Button type="submit" disabled={busy} className="flex-1 sm:min-w-36">{busy ? <><LoaderCircle className="animate-spin" />{isCompressing ? "Зураг боловсруулж байна" : "Хадгалж байна"}</> : <><Check />{isEditing ? "Өөрчлөлт хадгалах" : "Бүтээгдэхүүн нэмэх"}</>}</Button></div>
          </footer>
        </form>
      </section>
    </div>
  );
};

export default ProductModal;
