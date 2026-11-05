"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { CheckCircle2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { POST } from "@/apis/axios";
import { saveUserData } from "@/lib/authHelper";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/BackButton";

function apiError(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { error?: unknown; message?: unknown } | string | undefined;
    const message = typeof data === "string" ? data : data?.message ?? data?.error;
    if (typeof message === "string" && message.length < 220) return message;
  }
  return fallback;
}

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [developmentCode, setDevelopmentCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pendingEmail = params.get("email");
    if (pendingEmail) setEmail(pendingEmail);
    if (params.get("verify") === "1") setVerificationPending(true);
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const register = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanUsername.length < 2 || cleanUsername.length > 80) return setError("Нэр 2–80 тэмдэгт байх шаардлагатай.");
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return setError("Имэйлийн формат буруу байна.");
    if (password.length < 8 || password.length > 128) return setError("Нууц үг 8–128 тэмдэгт байх шаардлагатай.");
    if (password !== confirmPassword) return setError("Нууц үгүүд таарахгүй байна.");

    setLoading(true);
    try {
      const response = await POST({ route: "/api/auth/register", body: { username: cleanUsername, email: cleanEmail, password } });
      setEmail(cleanEmail);
      setVerificationPending(true);
      setResendIn(Number(response.data.resendInSeconds) || 60);
      setDevelopmentCode(typeof response.data.developmentCode === "string" ? response.data.developmentCode : "");
      setPassword("");
      setConfirmPassword("");
      setCode("");
      toast.success("Имэйлд баталгаажуулах код илгээлээ.");
    } catch (reason) {
      setError(apiError(reason, "Бүртгүүлж чадсангүй. Дахин оролдоно уу."));
      const axiosError = reason instanceof AxiosError ? reason : null;
      const responseStatus = axiosError?.response?.status;
      if (responseStatus === 409 && (axiosError?.response?.data as { error?: string })?.error === "EMAIL_VERIFICATION_REQUIRED") {
        setVerificationPending(true);
        setResendIn(0);
      } else if (responseStatus === 503) {
        // The backend keeps this account pending but clears the undelivered code,
        // so expose the resend path instead of trapping the user on signup.
        setVerificationPending(true);
        setResendIn(0);
        setPassword("");
        setConfirmPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (event: FormEvent) => {
    event.preventDefault();
    if (loading || code.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const response = await POST({ route: "/api/auth/register/verify", body: { email: email.trim().toLowerCase(), code } });
      await saveUserData(response.data);
      toast.success("Имэйл баталгаажлаа. Амжилттай нэвтэрлээ.");
      router.replace(response.data.isAdmin ? "/admin" : "/");
      router.refresh();
    } catch (reason) {
      setError(apiError(reason, "Код буруу эсвэл хугацаа нь дууссан байна."));
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (loading || resendIn > 0 || !/^\S+@\S+\.\S+$/.test(email.trim())) return;
    setError("");
    setLoading(true);
    try {
      const response = await POST({ route: "/api/auth/register/resend-code", body: { email: email.trim().toLowerCase() } });
      setResendIn(Number(response.data.resendInSeconds) || 60);
      setDevelopmentCode(typeof response.data.developmentCode === "string" ? response.data.developmentCode : "");
      toast.success("Хэрэв баталгаажуулах шаардлагатай бол шинэ код илгээгдэнэ.");
    } catch (reason) {
      setError(apiError(reason, "Код дахин илгээж чадсангүй."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh bg-white">
      <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-8"><BackButton goToHome /></div>
      <section className="flex w-full flex-col items-center justify-center px-5 py-16 md:w-1/2 md:px-8">
        <Image src="/Retevis/retevis.png" alt="Retevis Logo" width={280} height={94} priority className="mb-6 h-auto w-56 sm:w-64" />
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="p-2 sm:p-4">
            {verificationPending ? (
              <form onSubmit={verifyEmail} className="space-y-4" aria-labelledby="verify-email-title">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><Mail className="h-5 w-5" /></div>
                <h1 id="verify-email-title" className="text-2xl font-semibold tracking-tight text-slate-900">Имэйлээ баталгаажуулах</h1>
                <p className="text-sm leading-6 text-slate-600">Бүртгэлээ дуусгахын тулд имэйлд ирсэн 6 оронтой кодыг оруулна уу.</p>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={loading} placeholder="Цахим хаяг" aria-label="Цахим хаяг" className="h-11 rounded-lg border-slate-200 bg-slate-50" />
                {developmentCode && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950" role="status">Хөгжүүлэлтийн код: <strong className="ml-1 font-mono tracking-widest">{developmentCode}</strong></p>}
                <Input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required disabled={loading} placeholder="6 оронтой код" aria-label="Баталгаажуулах код" className="h-11 rounded-lg border-slate-200 bg-slate-50 text-center font-mono tracking-[0.35em]" />
                {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                <Button type="submit" className="h-11 w-full rounded-lg" disabled={loading || code.length !== 6}>{loading ? "Баталгаажуулж байна..." : "Имэйл баталгаажуулах"}</Button>
                <Button type="button" variant="outline" className="h-11 w-full rounded-lg" onClick={() => void resendCode()} disabled={loading || resendIn > 0 || !/^\S+@\S+\.\S+$/.test(email.trim())}>
                  {resendIn > 0 ? `Код дахин илгээх (${resendIn})` : "Шинэ код илгээх"}
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-xs leading-5 text-slate-500"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" />Код 10 минут хүчинтэй. Нэг удаа ашиглана.</p>
              </form>
            ) : (
              <>
                <h1 className="mb-5 text-2xl font-semibold tracking-tight text-slate-900">Бүртгэл үүсгэх</h1>
                <form onSubmit={register} className="space-y-4">
                  <Input type="text" autoComplete="username" placeholder="Нэр" value={username} onChange={(event) => setUsername(event.target.value)} disabled={loading} required minLength={2} maxLength={80} className="h-11 rounded-lg border-slate-200 bg-slate-50 px-4" />
                  <Input type="email" autoComplete="email" placeholder="Цахим хаяг" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} required className="h-11 rounded-lg border-slate-200 bg-slate-50 px-4" />
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Нууц үг (8–128 тэмдэгт)" value={password} onChange={(event) => setPassword(event.target.value)} disabled={loading} required minLength={8} maxLength={128} className="h-11 rounded-lg border-slate-200 bg-slate-50 px-4 pr-12" />
                    <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харах"} className="absolute inset-y-0 right-3 rounded px-2 text-xs text-slate-500 hover:text-slate-900">{showPassword ? "Нуух" : "Харах"}</button>
                  </div>
                  <div className="relative">
                    <Input type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="Нууц үг давтах" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} disabled={loading} required minLength={8} maxLength={128} className="h-11 rounded-lg border-slate-200 bg-slate-50 px-4 pr-12" />
                    <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Давтсан нууц үг нуух" : "Давтсан нууц үг харах"} className="absolute inset-y-0 right-3 rounded px-2 text-xs text-slate-500 hover:text-slate-900">{showConfirmPassword ? "Нуух" : "Харах"}</button>
                  </div>
                  {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                  <Button type="submit" className="h-11 w-full rounded-lg" disabled={loading}>{loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}</Button>
                </form>
              </>
            )}
            <Separator className="my-5" />
            <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
              <span>Бүртгэлтэй юу?</span>
              <Link href="/login" className="font-medium text-amber-800 hover:underline">Нэвтрэх</Link>
            </div>
          </CardContent>
        </Card>
      </section>
      <aside className="relative hidden min-h-dvh w-1/2 md:block">
        <Image src="/Auth.png" alt="Retevis Mongolia" fill priority sizes="50vw" className="object-cover" />
      </aside>
    </main>
  );
}
