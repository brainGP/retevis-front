"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { POST } from "@/apis/axios";
import { markGoogleLinked, saveUserData, type PublicUser } from "@/lib/authHelper";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(options: { client_id: string; callback: (response: { credential: string }) => void }): void;
          renderButton(element: HTMLElement, options: { theme: string; size: string; width: number; text: string }): void;
        };
      };
    };
  }
}

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ mode = "login" }: { mode?: "login" | "link" }) {
  const container = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const [loading, setLoading] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const router = useRouter();

  const handleCredential = useCallback(async (response: { credential: string }) => {
    setLoading(true);
    try {
      const result = await POST({ route: mode === "link" ? "/api/auth/google/link" : "/api/auth/google", body: { credential: response.credential } });
      if (mode === "link") {
        markGoogleLinked();
        toast.success("Google хаяг амжилттай холбогдлоо.");
        router.refresh();
      } else {
        await saveUserData(result.data as PublicUser);
        toast.success("Google хаягаар амжилттай нэвтэрлээ.");
        const requested = new URLSearchParams(window.location.search).get("next") || "";
        const destination = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/";
        router.push(result.data.isAdmin ? "/admin" : destination);
      }
    } catch (error: unknown) {
      const genericMessage = mode === "link"
        ? "Google холбож чадсангүй. Саяхан нэвтэрсэн эсэх болон ижил имэйл ашиглаж байгааг шалгана уу."
        : "Google нэвтрэлт амжилтгүй. Хаяг болон OAuth тохиргоогоо шалгана уу.";
      if (error instanceof AxiosError && !error.response) {
        toast.error("Backend API-д холбогдож чадсангүй. Backend URL, CORS болон серверийн ажиллагааг шалгана уу.");
      } else if (error instanceof AxiosError) {
        const body = error.response?.data as { error?: unknown; message?: unknown } | string | undefined;
        const serverMessage = typeof body === "string" ? body : body?.error ?? body?.message;
        if (
          mode === "login" &&
          error.response?.status === 409 &&
          typeof serverMessage === "string" &&
          serverMessage.startsWith("An account already uses this email")
        ) {
          toast.error("Энэ имэйлээр бүртгэл байна. Нууц үгээрээ нэвтрээд Профайл хэсгээс Google хаягаа холбоно уу.");
        } else {
          toast.error(typeof serverMessage === "string" && serverMessage.length <= 220 ? serverMessage : genericMessage);
        }
      } else {
        toast.error(genericMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [router, mode]);

  const initialize = useCallback(() => {
    if (!clientId || !container.current || !window.google || rendered.current) return false;
    const element = container.current;
    // Match the password-login button's full available width (inside CardContent).
    // Google Identity Services accepts widths from 200px to 400px.
    const width = Math.max(200, Math.min(400, Math.floor(element.getBoundingClientRect().width || 400)));
    try {
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
      window.google.accounts.id.renderButton(element, { theme: "outline", size: "large", width, text: mode === "link" ? "continue_with" : "signin_with" });
      rendered.current = true;
      setSdkError(false);
      return true;
    } catch {
      setSdkError(true);
      return false;
    }
  }, [handleCredential, mode]);

  useEffect(() => {
    if (!clientId) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (initialize()) window.clearInterval(timer);
      else if (attempts >= 60) {
        window.clearInterval(timer);
        if (!window.google) setSdkError(true);
      }
    }, 100);
    if (initialize()) window.clearInterval(timer);
    return () => window.clearInterval(timer);
  }, [initialize]);

  return (
    <div className="w-full space-y-2">
      {clientId ? <>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => { initialize(); }} onError={() => setSdkError(true)} />
        <div ref={container} className="flex min-h-11 w-full justify-center overflow-hidden rounded-lg" aria-busy={loading} />
        {loading && <p className="text-center text-sm text-gray-600" role="status">Нэвтэрч байна...</p>}
        {sdkError && <p className="text-center text-xs text-amber-700" role="status">Google товч ачаалсангүй. Интернэт холболтоо шалгаад хуудсыг дахин ачаална уу.</p>}
      </> : <p className="text-center text-xs text-gray-500">Google нэвтрэлт тохируулахад OAuth Client ID шаардлагатай.</p>}
    </div>
  );
}
