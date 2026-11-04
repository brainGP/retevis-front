"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductActions } from "./ProductActions";
import { Product } from "@/types/Product";
import { formatPrice } from "@/utils/formatPrice";
import { Check, Eye, EyeOff, LoaderCircle, PackageOpen, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type StockChanges = { quantity?: number; status?: boolean };
interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onStockUpdate: (product: Product, changes: StockChanges) => Promise<void>;
  updatingStockId: string | null;
}

const isActive = (status: Product["status"]) => status === true || String(status).toLowerCase() === "true";

function InventoryControls({ product, disabled, onUpdate }: { product: Product; disabled: boolean; onUpdate: (changes: StockChanges) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [quantity, setQuantity] = useState(String(Number(product.quantity) || 0));
  const [saving, setSaving] = useState(false);
  const active = isActive(product.status);
  useEffect(() => setQuantity(String(Number(product.quantity) || 0)), [product.quantity]);

  const saveQuantity = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = Number(quantity);
    if (!Number.isInteger(parsed) || parsed < 0) {
      toast.error("Үлдэгдэл 0 буюу түүнээс их бүхэл тоо байна.");
      return;
    }
    setSaving(true);
    try {
      await onUpdate({ quantity: parsed });
      setEditing(false);
      toast.success("Үлдэгдэл шинэчлэгдлээ.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Үлдэгдэл шинэчилж чадсангүй.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async () => {
    setSaving(true);
    try {
      await onUpdate({ status: !active });
      toast.success(active ? "Барааг storefront-оос нуув." : "Барааг storefront дээр идэвхжүүлэв.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Төлөв шинэчилж чадсангүй.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) return <form onSubmit={saveQuantity} className="flex items-center gap-1.5"><Input autoFocus type="number" inputMode="numeric" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} aria-label={`${product.name} үлдэгдэл`} className="h-8 w-20 rounded-md px-2 text-sm tabular-nums" disabled={saving} /><Button size="icon" type="submit" aria-label="Үлдэгдэл хадгалах" disabled={saving} className="h-8 w-8">{saving ? <LoaderCircle className="animate-spin" /> : <Check />}</Button><Button size="icon" type="button" variant="ghost" aria-label="Цуцлах" onClick={() => { setEditing(false); setQuantity(String(Number(product.quantity) || 0)); }} disabled={saving} className="h-8 w-8"><X /></Button></form>;

  return <div className="flex items-center gap-2"><span className="min-w-16 text-sm font-medium tabular-nums text-slate-900">{Number(product.quantity) || 0} ш</span><Button type="button" variant="ghost" size="icon" aria-label={`${product.name} үлдэгдэл засах`} title="Үлдэгдэл засах" onClick={() => setEditing(true)} disabled={disabled || saving} className="h-8 w-8 text-slate-500"><Pencil /></Button><Button type="button" variant="ghost" size="sm" title={active ? "Дэлгүүрт харагдаж байгаа" : "Дэлгүүрт нуусан"} onClick={toggleActive} disabled={disabled || saving} className={`h-8 gap-1.5 px-2 ${active ? "text-green-700 hover:bg-green-50" : "text-slate-500 hover:bg-slate-100"}`}>{saving ? <LoaderCircle className="animate-spin" /> : active ? <Eye /> : <EyeOff />}<span className="hidden xl:inline">{active ? "Идэвхтэй" : "Нууц"}</span></Button></div>;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete, onStockUpdate, updatingStockId }) => (
  <div className="w-full overflow-x-auto">
    <Table className="min-w-[850px]">
      <TableHeader className="bg-slate-50/80"><TableRow className="hover:bg-transparent"><TableHead className="w-16">Зураг</TableHead><TableHead>Бүтээгдэхүүн</TableHead><TableHead>Ангилал</TableHead><TableHead className="min-w-[250px]">Үлдэгдэл · дэлгүүрт харагдах</TableHead><TableHead className="text-right">Үнэ (НӨАТ-тай)</TableHead><TableHead className="w-36 text-right">Үйлдэл</TableHead></TableRow></TableHeader>
      <TableBody>
        {products.length ? products.map((product) => <TableRow key={product._id} className="group">
          <TableCell><div className="relative h-11 w-11 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">{product.images?.[0]?.image ? <Image src={product.images[0].image} alt="" fill sizes="44px" className="object-contain p-1" /> : <div className="flex h-full w-full items-center justify-center text-slate-400"><PackageOpen className="h-4 w-4" /></div>}</div></TableCell>
          <TableCell><div className="max-w-[330px]"><p className="truncate font-medium text-slate-900">{product.name}</p><p className="mt-0.5 truncate text-xs text-slate-500">{product.brand}{product.model ? ` · ${product.model}` : ""}</p></div></TableCell>
          <TableCell><span className="text-sm text-slate-600">{product.sort || "—"}</span></TableCell>
          <TableCell><InventoryControls product={product} disabled={updatingStockId !== null} onUpdate={(changes) => onStockUpdate(product, changes)} /></TableCell>
          <TableCell className="text-right font-medium tabular-nums text-slate-900">{formatPrice(product.priceN)}₮</TableCell>
          <TableCell><ProductActions product={product} onEdit={onEdit} onDelete={onDelete} /></TableCell>
        </TableRow>) : <TableRow><TableCell colSpan={6} className="h-48"><div className="flex flex-col items-center justify-center gap-2 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500"><PackageOpen className="h-5 w-5" /></span><p className="font-medium text-slate-800">Бүтээгдэхүүн олдсонгүй</p><p className="text-sm text-slate-500">Шүүлтээ өөрчлөх эсвэл шинэ бүтээгдэхүүн нэмнэ үү.</p></div></TableCell></TableRow>}
      </TableBody>
    </Table>
    <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">{products.length.toLocaleString("mn-MN")} бүтээгдэхүүн · Үлдэгдэл болон харагдах төлөвийг эндээс өөрчилнө</p>
  </div>
);

export default ProductTable;
