"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/hooks/useCarts";
import { formatPrice } from "@/utils/formatPrice";

const MESSENGER_URL = "https://m.me/RetevisMongolia";
const InquiryOpenContext = createContext<(() => void) | null>(null);

export function useOpenMessengerInquiry() {
  const open = useContext(InquiryOpenContext);
  if (!open) throw new Error("useOpenMessengerInquiry must be used within MessengerInquiryProvider");
  return open;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const success = document.execCommand("copy");
  field.remove();
  if (!success) throw new Error("Clipboard access failed");
}

function MessengerInquiryDialog({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const {
    cartProducts: savedProducts,
    cartTotalQty,
    cartTotalAmount,
    handleCartQtyDecrease,
    handleCartQtyIncrease,
    handleRemoveProductFromCart,
  } = useCart();
  const cartProducts = savedProducts || [];
  const hasUnknownPrice = cartProducts.some((product) => !Number.isFinite(Number(product.priceN)) || Number(product.priceN) <= 0);
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [shareFailed, setShareFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      setCopied(false);
      setCopyFailed(false);
      setShareFailed(false);
      dialog.showModal();
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const buildInquiryMessage = () => [
      "Сайн байна уу, дараах бараануудын үнэ болон бэлэн эсэхийг лавлая:",
      "",
      ...cartProducts.map((product) => {
        const productUrl = new URL(`/stations/${encodeURIComponent(product.name)}`, window.location.origin).toString();
        const unitPrice = Number.isFinite(Number(product.priceN)) && Number(product.priceN) > 0
          ? `${formatPrice(product.priceN)}₮`
          : "Үнийг лавлах";
        return [
          `• ${product.name}`,
          `  Брэнд: ${product.brand || "Тодорхойгүй"}`,
          `  Үнэ: ${unitPrice} / ш`,
          `  Тоо: ${product.quantity} ширхэг`,
          `  Холбоос: ${productUrl}`,
        ].join("\n");
      }),
      "",
      hasUnknownPrice
        ? "Тооцоолсон дүн: үнийн мэдээлэл дутуу, чатаар баталгаажуулна."
        : `Тооцоолсон дүн: ${formatPrice(cartTotalAmount)}₮`,
      "Баярлалаа.",
    ].join("\n");

  const copyMessage = (message: string) => {
    void copyText(message).then(
      () => {
        setCopied(true);
        setCopyFailed(false);
      },
      () => {
        setCopied(false);
        setCopyFailed(true);
      },
    );
  };

  const shareInquiry = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const message = buildInquiryMessage();
    if (typeof navigator.share !== "function" || shareFailed) {
      setShareFailed(true);
      copyMessage(message);
      return;
    }

    // The Web Share sheet lets the customer choose Messenger (or another app)
    // and hands it a prefilled message. Messenger does not support silently
    // sending a message or prefilling a recipient through an m.me URL.
    event.preventDefault();
    setCopied(false);
    setCopyFailed(false);
    void navigator.share({ title: "Retevis Mongolia – үнийн лавлагаа", text: message }).then(
      () => setCopied(true),
      (error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setShareFailed(true);
        copyMessage(message);
      },
    );
  };

  const showFloatingButton = cartProducts.length > 0 && pathname !== "/cart" && !pathname.startsWith("/admin");

  return (
    <>
      {showFloatingButton && (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          aria-label={`${cartTotalQty} барааны Messenger лавлагаа`}
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex min-h-12 max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-amber-400 bg-[#ffac04] px-4 text-sm font-semibold text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-[#f6a400] hover:shadow-[0_12px_28px_rgba(15,23,42,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
        >
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span>Сонголт</span>
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-1.5 text-xs text-white">{cartTotalQty}</span>
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="inquiry-title"
        aria-describedby="inquiry-description"
          onClose={() => onOpenChange(false)}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onOpenChange(false);
        }}
        className="fixed inset-0 m-auto h-[min(86dvh,44rem)] max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%-3rem)]"
      >
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-800"><ShoppingBag className="h-4 w-4" /></span>
                <h2 id="inquiry-title" className="text-lg font-semibold sm:text-xl">Сонирхсон бараа</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{cartProducts.length}</span>
              </div>
              <p id="inquiry-description" className="mt-2 text-sm text-slate-500">Жагсаалтаа шалгаад бэлэн хүсэлтээ Messenger-ээр хуваалцаарай.</p>
            </div>
            <button type="button" onClick={() => onOpenChange(false)} aria-label="Хаах" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"><X className="h-4 w-4" /></button>
          </header>

          {cartProducts.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-800"><ShoppingBag className="h-6 w-6" /></span>
              <p className="mt-4 font-medium text-slate-800">Одоогоор сонгосон бараа алга</p>
              <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">Сонирхсон станцаа үзээд “Сонголтод нэмэх” товчоор жагсаалтдаа хадгалаарай.</p>
              <Link href="/stations" onClick={() => onOpenChange(false)} className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#ffac04] px-4 text-sm font-semibold text-slate-950 transition hover:bg-[#f6a400]">Станц үзэх <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-slate-50/70 px-3 py-3 sm:px-5 sm:py-4">
                {cartProducts.map((product) => (
                  <div key={product._id} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 sm:gap-3 sm:p-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f7f6f2] p-1 sm:h-[4.5rem] sm:w-[4.5rem]">
                      <ProductImage src={product.images?.[0]?.image} alt={product.name} fill sizes="72px" className="object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{product.brand} · {Number.isFinite(Number(product.priceN)) && Number(product.priceN) > 0 ? `${formatPrice(product.priceN)}₮ / ш` : "Үнэ лавлах"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
                      <button type="button" onClick={() => handleCartQtyDecrease(product)} disabled={product.quantity <= 1} aria-label={`${product.name} тоо ширхэг хасах`} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-5 text-center text-sm tabular-nums">{product.quantity}</span>
                      <button type="button" onClick={() => handleCartQtyIncrease(product)} disabled={product.quantity >= 99} aria-label={`${product.name} тоо ширхэг нэмэх`} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button type="button" onClick={() => handleRemoveProductFromCart(product)} aria-label={`${product.name} жагсаалтаас хасах`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>

              <footer className="border-t border-slate-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">{cartProducts.length} нэр төрөл · {cartTotalQty} ширхэг</p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900"><span className="mr-1 text-xs font-medium text-slate-500">Тооцоолсон дүн</span>{hasUnknownPrice ? "Үнэ лавлах" : `${formatPrice(cartTotalAmount)}₮`}</p>
                  </div>
                  <p className="max-w-[10rem] text-right text-xs leading-5 text-slate-500">Үнэ, бэлэн эсэхийг чатад баталгаажуулна.</p>
                </div>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={shareInquiry}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffac04] px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-[#f6a400] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {shareFailed ? "Messenger чат нээх" : "Messenger-ээр мессежээ бэлдэх"} <ArrowUpRight className="h-4 w-4" />
                </a>
                <p className="mt-2 min-h-4 text-center text-xs text-slate-500" aria-live="polite">
                  {copied ? <span className="inline-flex items-center gap-1 text-emerald-700"><Check className="h-3.5 w-3.5" /> {shareFailed ? "Бэлэн хүсэлт хуулагдлаа. Messenger чатад буулгаж илгээнэ үү." : "Хуваалцах хүсэлт дууслаа. Сонгосон апп дээр мессежээ шалгана уу."}</span> : copyFailed ? "Хуваалцах боломжгүй байна. Messenger дээр мессежээ гараар бичнэ үү." : "Messenger-ийг сонгоход барааны мэдээлэл, үнэ, тоо болон холбоос бэлэн болно."}
                </p>
              </footer>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

export function MessengerInquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = useCallback(() => setIsOpen(true), []);

  return (
    <InquiryOpenContext.Provider value={openDialog}>
      {children}
      <MessengerInquiryDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </InquiryOpenContext.Provider>
  );
}
