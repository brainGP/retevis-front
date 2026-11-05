"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Share2, X } from "lucide-react";
import { FaEnvelope, FaFacebookF, FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface ShareProductButtonProps {
  title: string;
  description: string;
  url: string;
}

async function copyLink(url: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  const input = document.createElement("textarea");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Clipboard unavailable");
}

export default function ShareProductButton({ title, description, url }: ShareProductButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const copy = async () => {
    try {
      await copyLink(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const shareWithDevice = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description, url });
      } else {
        await copy();
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setCopied(false);
    }
  };

  const shareToInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        return;
      } catch (error) {
        // A user canceling the system share sheet should not unexpectedly open another page.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await copyLink(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }

    setOpen(false);
    window.location.assign("https://www.instagram.com/direct/inbox/");
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}\n${description}\n${url}`);
  const options = [
    {
      label: "Facebook",
      icon: <FaFacebookF aria-hidden="true" />,
      className: "text-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      icon: <FaWhatsapp aria-hidden="true" />,
      className: "text-[#25D366]",
      href: `https://wa.me/?text=${encodedText}`,
    },
    {
      label: "Telegram",
      icon: <FaTelegramPlane aria-hidden="true" />,
      className: "text-[#229ED9]",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
    },
    {
      label: "Instagram",
      icon: <FaInstagram aria-hidden="true" />,
      className: "text-[#D62976]",
      href: "https://www.instagram.com/direct/inbox/",
    },
    {
      label: "X",
      icon: <FaXTwitter aria-hidden="true" />,
      className: "text-slate-950",
      href: `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodedUrl}`,
    },
    {
      label: "Threads",
      icon: <FaThreads aria-hidden="true" />,
      className: "text-slate-950",
      href: `https://www.threads.com/intent/post?text=${encodeURIComponent(title)}&url=${encodedUrl}`,
    },
    {
      label: "Имэйл",
      icon: <FaEnvelope aria-hidden="true" />,
      className: "text-slate-600",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}`,
    },
  ];

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`${title} бүтээгдэхүүнийг хуваалцах`}
        className="shrink-0 border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50"
      >
        <Share2 className="h-4 w-4" />
        <span>Хуваалцах</span>
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-description"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
          if (outside) setOpen(false);
        }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md overflow-visible rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/45"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 id="share-dialog-title" className="text-lg font-semibold tracking-tight">Хуваалцах</h2>
              <p id="share-dialog-description" className="mt-1 line-clamp-2 text-sm text-slate-500">{title}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Хаах"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5">
            <label htmlFor="share-product-url" className="mb-2 block text-xs font-medium text-slate-600">Хуудасны холбоос</label>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pl-3 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100">
              <input
                id="share-product-url"
                readOnly
                value={url}
                onFocus={(event) => event.currentTarget.select()}
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-600 outline-none"
                aria-label="Хуваалцах холбоос"
              />
              <Button type="button" onClick={copy} className="h-9 shrink-0 rounded-lg bg-slate-900 px-3 text-white hover:bg-slate-700">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Хуулагдлаа" : "Хуулах"}</span>
              </Button>
            </div>
            <p className="mt-2 min-h-4 text-xs text-emerald-700" aria-live="polite">{copied ? "Холбоос clipboard-д хуулагдлаа." : ""}</p>
          </div>

          <div className="mt-3">
            <p className="mb-3 text-xs font-medium text-slate-600">Хуваалцах сувгаа сонгоно уу</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {options.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  target={option.label === "Имэйл" ? undefined : "_blank"}
                  rel={option.label === "Имэйл" ? undefined : "noopener noreferrer"}
                  onClick={(event) => {
                    if (option.label === "Instagram") {
                      event.preventDefault();
                      void shareToInstagram();
                    }
                  }}
                  className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs font-medium text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <span className={`text-lg ${option.className}`}>{option.icon}</span>
                  {option.label}
                </a>
              ))}
              <button
                key="device-share"
                type="button"
                onClick={shareWithDevice}
                className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-3 text-xs font-medium text-slate-700 transition-colors hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Share2 className="h-5 w-5 text-slate-700" aria-hidden="true" />
                Бусад апп
              </button>
            </div>
            <p className="mt-3 min-h-4 text-xs text-slate-500" aria-live="polite">
              Instagram-д шууд холбоос нийтлэх боломжгүй тул төхөөрөмжийн share цэс эсвэл Instagram зурвасыг нээнэ.
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
