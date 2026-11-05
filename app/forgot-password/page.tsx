"use client";

import { FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { POST } from "@/apis/axios";
import { logoutUser } from "@/lib/authHelper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function apiError(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { error?: unknown; message?: unknown } | string | undefined;
    const message = typeof data === "string" ? data : data?.message ?? data?.error;
    if (typeof message === "string" && message.length < 220) return message;
  }
  return fallback;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requested, setRequested] = useState(false);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [developmentCode, setDevelopmentCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const requestCode = async (event?: FormEvent) => {
    event?.preventDefault();
    if (busy || !/^\S+@\S+\.\S+$/.test(email.trim())) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const response = await POST({ route: "/api/auth/password/forgot/request-code", body: { email: email.trim().toLowerCase() } });
      setRequested(true);
      setResendIn(Number(response.data.resendInSeconds) || 60);
      setDevelopmentCode(typeof response.data.developmentCode === "string" ? response.data.developmentCode : "");
      setSuccess("Хэрэв энэ имэйл бүртгэлтэй, баталгаажсан бол код илгээгдэнэ. Ирсэн эсэхийг шалгана уу.");
    } catch (reason) {
      setError(apiError(reason, "Код илгээх хүсэлт амжилтгүй боллоо. Түр хүлээгээд дахин оролдоно уу."));
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setSuccess("");
    if (code.length !== 6) return setError("Имэйлээр ирсэн 6 оронтой кодыг оруулна уу.");
    if (password.length < 8 || password.length > 128) return setError("Нууц үг 8–128 тэмдэгт байх шаардлагатай.");
    if (password !== confirmPassword) return setError("Нууц үгүүд таарахгүй байна.");

    setBusy(true);
    try {
      await POST({ route: "/api/auth/password/forgot/confirm", body: { email: email.trim().toLowerCase(), code, password } });
      await logoutUser();
      toast.success("Нууц үг шинэчлэгдлээ. Шинэ нууц үгээрээ нэвтэрнэ үү.");
      router.replace("/login?passwordReset=1");
    } catch (reason) {
      setError(apiError(reason, "Код буруу эсвэл хугацаа нь дууссан байна. Шинэ код авч дахин оролдоно уу."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh bg-white">
      <section className="flex w-full flex-col items-center justify-center px-5 py-14 md:w-1/2 md:px-8">
        <div className="mb-6 w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Нэвтрэх рүү буцах</Link>
        </div>
        <Image src="/Retevis/retevis.png" alt="Retevis Logo" width={280} height={94} priority className="mb-6 h-auto w-56 sm:w-64" />
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="p-2 sm:p-4">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><ShieldCheck className="h-5 w-5" /></div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Нууц үг сэргээх</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Бүртгэлтэй имэйл рүү нэг удаагийн код илгээж, шинэ нууц үг тохируулна.</p>

            <form onSubmit={requested ? resetPassword : requestCode} className="mt-5 space-y-3">
              <Input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Цахим хаяг" aria-label="Бүртгэлтэй цахим хаяг" required disabled={busy || requested} className="h-11 rounded-lg border-slate-200 bg-slate-50" />
              {requested && <>
                {developmentCode && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950" role="status">Хөгжүүлэлтийн код: <strong className="ml-1 font-mono tracking-widest">{developmentCode}</strong></p>}
                <Input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="6 оронтой код" aria-label="Имэйлээр ирсэн код" required disabled={busy} className="h-11 rounded-lg border-slate-200 bg-slate-50 text-center font-mono tracking-[0.35em]" />
                <Input type="password" autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Шинэ нууц үг (8–128 тэмдэгт)" aria-label="Шинэ нууц үг" required disabled={busy} className="h-11 rounded-lg border-slate-200 bg-slate-50" />
                <Input type="password" autoComplete="new-password" minLength={8} maxLength={128} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Шинэ нууц үг давтах" aria-label="Шинэ нууц үг давтах" required disabled={busy} className="h-11 rounded-lg border-slate-200 bg-slate-50" />
              </>}
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
              {success && <p className="flex items-start gap-2 text-sm leading-5 text-slate-600" role="status"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{success}</p>}
              {!requested ? (
                <Button type="submit" className="h-11 w-full rounded-lg" disabled={busy || !/^\S+@\S+\.\S+$/.test(email.trim())}><Mail className="h-4 w-4" />{busy ? "Илгээж байна..." : "Баталгаажуулах код авах"}</Button>
              ) : <>
                <Button type="submit" className="h-11 w-full rounded-lg" disabled={busy || code.length !== 6}>{busy ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}</Button>
                <Button type="button" variant="outline" className="h-11 w-full rounded-lg" disabled={busy || resendIn > 0} onClick={() => void requestCode()}>{resendIn > 0 ? `Код дахин авах (${resendIn})` : "Шинэ код илгээх"}</Button>
                <p className="text-center text-xs leading-5 text-slate-500">Код 10 минут хүчинтэй, 5 удаа буруу оруулбал шинээр код авах шаардлагатай.</p>
              </>}
            </form>
          </CardContent>
        </Card>
      </section>
      <aside className="relative hidden min-h-dvh w-1/2 md:block"><Image src="/Auth.png" alt="Retevis Mongolia" fill priority sizes="50vw" className="object-cover" /></aside>
    </main>
  );
}
